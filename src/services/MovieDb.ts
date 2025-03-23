import * as fs from 'fs'
import {type Cast, type CreditsResponse, type Crew, MovieDb as MovieDbApi, type MovieResponse, type Person as TmdbPerson, type PersonMovieCreditsResponse} from 'moviedb-promise'
import {
  type CastCredit,
  type CrewCredit,
  isMovieSearchResult,
  isPersonSearchResult,
  type Movie,
  type MovieInfo,
  type Person,
  type PersonWithoutFav,
  type Provider
} from '../../types'
import getToken from '../utils/getToken'
import {dataDir} from './dataStorage'
import {type Movie as ApiMovie, type MovieCredit, type Person as ApiPerson, type PersonCredit, type SearchResult, ThingType} from '../apiTypes'

interface Cache {
  movieInfo: {
    [id: Movie['id']]: ApiMovie;
  }
  movieCredits: {
    [id: Movie['id']]: MovieCredit[];
  }
  personCredits: {
    [id: Person['id']]: PersonCredit[];
  }
  personInfo: {
    [id: Person['id']]: ApiPerson
  },
  allProviders: Record<string, Record<Provider['id'], Provider>>,
  movieProviders: Record<Movie['id'], Record<string, Provider['id'][]>>
}

const key = getToken('TMDB_TOKEN')

export default class MovieDb {
  static FILE_PATH = `${dataDir}/moviedb_cache.json`
  private static movieDbApi = new MovieDbApi(key)
  private static cache: Cache = MovieDb.readCache()

  static async personInfo(id: Person['id']): Promise<ApiPerson> {
    if (!MovieDb.cache.personInfo[id]) {
      const person = await MovieDb.movieDbApi.personInfo({id})
      MovieDb.cache.personInfo[id] = convertPerson(person)
    }
    return MovieDb.cache.personInfo[id]
  }

  static async getPersonCredits(id: Person['id']): Promise<PersonCredit[]> {
    if (!MovieDb.cache.personCredits[id]) {
      const response = await MovieDb.movieDbApi.personMovieCredits({id})
      const cast = filterInvalidCredits(response.cast!)
      const crew = filterInvalidCredits(response.crew!)

      const credits = [...cast, ...crew]
        .sort((credit1, credit2) => (credit1.release_date || '9') < (credit2.release_date || '9') ? 1 : -1)
        .map(convertPersonCredit)

      MovieDb.cache.personCredits[id] = aggregatePersonCredits(credits)
      MovieDb.save()
    }
    return MovieDb.cache.personCredits[id]
  }

  static async movieInfo(id: Movie['id']): Promise<ApiMovie> {
    if (!MovieDb.cache.movieInfo[id]) {
      const movie = await MovieDb.movieDbApi.movieInfo({id})
      MovieDb.cache.movieInfo[id] = convertMovie(movie)
      MovieDb.save()
    }
    return MovieDb.cache.movieInfo[id]
  }

  static async getMovieCredits(id: string, options?: { type?: 'Crew' | 'Cast' }): Promise<MovieCredit[]> {
    if (!MovieDb.cache.movieCredits[id]) {
      const response = await MovieDb.movieDbApi.movieCredits(id)

      const crew = filterInsignificantPeople(response.crew!)
      const cast = response.cast!
      const credits = [...cast, ...crew].map(convertMovieCredit)
      MovieDb.cache.movieCredits[id] = aggregateMovieCredits(credits).sort(sortByRole)
      MovieDb.save()
    }

    if (!options?.type) {
      return MovieDb.cache.movieCredits[id]
    } else {
      return MovieDb.cache.movieCredits[id].filter(credit => options.type === 'Crew' ? credit.jobs.length : credit.characters.length)
    }
  }

  static async search(query: string): Promise<SearchResult[]> {
    const {results} = await MovieDb.movieDbApi.searchMulti({query})
    return results!
      .filter(result => isMovieSearchResult(result) || isPersonSearchResult(result))
      .map(result => {
        if (isMovieSearchResult(result)) {
          return { id: `${result.id}`, title: result.title || 'Title unknown', releaseDate: result.release_date, posterPath: result.poster_path, type: ThingType.Movie }
        } else {
          return { id: `${result.id}`, name: result.name || 'Name unknown', profilePath: result.profile_path, type: ThingType.Person }
        }
      })
  }

  static async discoverBasedOnPeople(personIds: Person['id'][]): Promise<ApiMovie[]> {
    const recommendedMovies = await Promise.all(
      personIds.map(async id => (await MovieDb.movieDbApi.discoverMovie({with_people: id})).results!)
    )
    return recommendedMovies
      .flat()
      .map(convertMovie);
  }

  static async discoverBasedOnMovies(movieIds: Movie['id'][]): Promise<ApiMovie[]> {
    const recommendedMovies = await Promise.all(
      movieIds.map(async id => (await MovieDb.movieDbApi.movieRecommendations({id})).results!)
    )
    return recommendedMovies
      .flat()
      .map(convertMovie);
  }

  static async trending(size: number): Promise<ApiMovie[]> {
    const {results} = await MovieDb.movieDbApi.trending({time_window: 'week', media_type: 'movie'})
    return results!
      .map(convertMovie)
      .slice(0, size)
  }

  static async streamingProviders(movieId: Movie['id'], region: string): Promise<Provider[]> {
    if (!MovieDb.cache.movieProviders[movieId]) {
      if (!MovieDb.cache.allProviders[region]) {
        await MovieDb.allStreamingProviders(region)
      }
      const {results} = await this.movieDbApi.movieWatchProviders({id: movieId})
      const movieProviders: Record<string, Provider['id'][]> = {}
      for (const [region, {flatrate}] of Object.entries(results!)) {
        movieProviders[region] = flatrate?.map(provider => `${provider.provider_id}`) || []
      }
      MovieDb.cache.movieProviders[movieId] = movieProviders
      MovieDb.save()
    }
    return (MovieDb.cache.movieProviders[movieId][region] || [])
      .map(providerId => MovieDb.cache.allProviders[region][providerId])
      .filter(provider => !!provider)
  }

  static async allStreamingProviders(region: string): Promise<Provider[]> {
    if (!MovieDb.cache.allProviders[region]) {
      const {results} = await this.movieDbApi.movieWatchProviderList({watch_region: region})
      const providers = results?.map(provider => ({
        id: `${provider.provider_id!}`,
        name: provider.provider_name!,
        logo: provider.logo_path!
      })) || []
      const providersMap: Record<Provider['id'], Provider> = {}
      for (const provider of providers) {
        providersMap[provider.id] = provider
      }
      MovieDb.cache.allProviders[region] = providersMap
      MovieDb.save()
    }
    return Object.values(MovieDb.cache.allProviders[region])
  }

  static save(): void {
    fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(MovieDb.cache))
  }

  private static readCache(): Cache {
    if (!fs.existsSync(MovieDb.FILE_PATH)) {
      const initial: Cache = {personInfo: {}, movieCredits: {}, personCredits: {}, movieInfo: {}, allProviders: {}, movieProviders: {}}
      fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(initial))
    }
    return JSON.parse(fs.readFileSync(MovieDb.FILE_PATH, 'utf-8'))
  }
}

function filterInvalidCredits<T extends { vote_count?: number, job?: string }>(credits: T[]): T[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return credits.filter(movie => !!movie.vote_count && (!movie.job || !ignoredRoles.includes(movie.job)))
}

function aggregatePersonCredits(credits: PersonCredit[]): PersonCredit[] {
  const movieIds = credits.map(c => c.movie.id)
  const creditsById: Record<string, PersonCredit> = {}
  for (const credit of credits) {
    if (!creditsById[credit.movie.id]) {
      creditsById[credit.movie.id] = credit
    } else {
      creditsById[credit.movie.id].jobs.push(...credit.jobs)
      creditsById[credit.movie.id].characters.push(...credit.characters)
    }
  }
  return Object.values(creditsById)
    .sort((creditA, creditB) => movieIds.indexOf(creditB.movie.id) - movieIds.indexOf(creditA.movie.id))
}

function aggregateMovieCredits(credits: MovieCredit[]): MovieCredit[] {
  const creditsById: Record<string, MovieCredit> = {}
  for (const credit of credits) {
    if (!creditsById[credit.person.id]) {
      creditsById[credit.person.id] = credit
    } else {
      creditsById[credit.person.id].jobs.push(...credit.jobs)
      creditsById[credit.person.id].characters.push(...credit.characters)
    }
  }
  console.log('done aggreaging:', JSON.stringify(creditsById, null, 2))
  return Object.values(creditsById)
}

function normaliseJob(job: string): string {
  return job
    .replace('Executive ', '')
    .replace('Associate ', '')
    .replace('Special Guest ', '')
    .replace('Co-Director', 'Director')
    .replace('Co-Producer', 'Producer')
    .replace('Assistant Director', 'Music')
    .replace('Music Producer', 'Music')
    .replace('Orchestrator', 'Music')
    .replace('Music Arranger', 'Music')
    .replace('Conductor', 'Music')
    .replace('Theme Song Performance', 'Music')
    .replace('Original Music Composer', 'Music')
    .replace('Sound Designer', 'Sound')
    .replace('Sound Editor', 'Sound')
    .replace('Sound Mixer', 'Sound')
    .replace('Sound Re-Recording Mixer', 'Sound')
    .replace('Sound Effects', 'Sound')
    .replace('Art Direction', 'Art')
    .replace('Art Designer', 'Art')
    .replace('Production Design', 'Art')
    .replace('Special Effects', 'Effects')
    .replace('Set Designer', 'Set')
    .replace('Set Decoration', 'Set')
    .replace('Screenplay', 'Writer')
    .replace('Scenario Writer', 'Writer')
    .replace('Theatre Play', 'Writer')
    .replace('Story', 'Writer')
    .replace('Author', 'Writer')
    .replace('Script', 'Writer')
    .replace('Theme Song Performance', 'Writer')
    .replace('Additional Writing', 'Writer')
    .replace('Idea', 'Writer')
    .replace('Technical Advisor', 'Advisor')
    .replace('Script Consultant', 'Advisor')
    .replace('Creative Consultant', 'Advisor')
    .replace('Camera', 'Cameras')
    .replace('Camera Operator', 'Cameras')
    .replace('Cameras Operator', 'Cameras')
    .replace('First Assistant Cameras', 'Cameras')
    .replace('Second Assistant Cameras', 'Cameras')
    .replace('Director of Photography', 'Cinematography')
    .replace('"A" Cameras', 'Cinematography')
}

function filterInsignificantPeople(crew: Crew[]): Crew[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return crew.filter(personCredit => !!personCredit.job && !ignoredRoles.includes(personCredit.job))
}

function sortByRole(creditA: MovieCredit, creditB: MovieCredit): number {
  const jobsByImportance = [
    'Casting', 'Editor', 'Music', 'Sound', 'Producer', 'Cinematography', 'Writer', 'Director',
  ]
  const creditAPrecedence = Math.max(...(creditA.jobs || []).map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  const creditBPrecedence = Math.max(...(creditB.jobs || []).map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  return creditAPrecedence > creditBPrecedence ? -1 : 1
}

function convertMovie(movie: MovieResponse): ApiMovie {
  return {
    id: `${movie.id}`,
    title: movie.title!,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    overview: movie.overview!,
    tagline: movie.tagline!,
    voteAverage: movie.vote_average || 0,
    imdbId: movie.imdb_id!
  }
}

function convertPerson(person: TmdbPerson): ApiPerson {
  return {
    id: `${person.id}`,
    name: person.name || 'Name unknown',
    biography: person.biography || '',
    knownForDepartment: person.known_for_department,
    profilePath: person.profile_path!,
  }
}

interface MovieDbCrewCredit {
  id?: number;
  department?: string;
  original_language?: string;
  original_title?: string;
  job?: string;
  overview?: string;
  vote_count?: number;
  video?: boolean;
  poster_path?: string | null;
  backdrop_path?: string | null;
  title?: string;
  popularity?: number;
  genre_ids?: number[];
  vote_average?: number;
  adult?: boolean;
  release_date?: string;
  credit_id?: string;
}
interface MovieDbCastCredit {
  character?: string;
  credit_id?: string;
  release_date?: string;
  vote_count?: number;
  video?: boolean;
  adult?: boolean;
  vote_average?: number | number;
  title?: string;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  popularity?: number;
  id?: number;
  backdrop_path?: string | null;
  overview?: string;
  poster_path?: string | null;
}
function convertPersonCredit(credit: MovieDbCrewCredit | MovieDbCastCredit): PersonCredit {
  return {
    id: credit.credit_id!,
    movie: {
      id: `${credit.id}`,
      title: credit.title!,
      releaseDate: credit.release_date,
      posterPath: credit.poster_path || undefined
    },
    jobs: 'job' in credit && credit.job ? [normaliseJob(credit.job)] : ['Actor'],
    characters: 'character' in credit && credit.character ? credit.character.split(' / ') : []
  }
}

function convertMovieCredit(credit: Cast | Crew): MovieCredit {
  return {
    id: credit.credit_id!,
    person: {
      id: `${credit.id}`,
      name: credit.name!,
      profilePath: credit.profile_path || undefined
    },
    jobs: 'job' in credit && credit.job ? [normaliseJob(credit.job)] : ['Actor'],
    characters: 'character' in credit && credit.character ? credit.character.split(' / ') : [],
    castOrder: 'order' in credit ? credit.order || 9999 : undefined
  }
}
