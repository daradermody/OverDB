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
  movieCrew: {
    [id: Movie['id']]: CrewCredit[];
  }
  movieCast: {
    [id: Movie['id']]: CastCredit[];
  }
  personMovieCredits: {
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

  static async personMovieCredits(id: Person['id']): Promise<PersonCredit[]> {
    if (!MovieDb.cache.personMovieCredits[id]) {
      const response = await MovieDb.movieDbApi.personMovieCredits({id})
      const cast = response.cast as Required<NonNullable<PersonMovieCreditsResponse['cast']>[number]>[]
      const crew = response.crew as Required<NonNullable<PersonMovieCreditsResponse['crew']>[number]>[]
      const crewMovies = filterInvalidMovies(crew)
      const castMovies = filterInvalidMovies(cast.map(c => ({...c, job: 'Actor'})))
      const aggregatedMovieCredits = aggregateAndNormalizeJobs([...castMovies, ...crewMovies])
      // TODO: Check what credit.character is when actor is multiple characters
      console.log(castMovies.filter(credit => credit.title === 'Cloud Atlas').map(c => c.character))
      MovieDb.cache.personMovieCredits[id] = aggregatedMovieCredits
        .sort((credit1, credit2) => credit1.release_date < credit2.release_date ? 1 : -1)
        .map((credit): PersonCredit => ({
          id: credit.credit_id,
          movie: {
            id: `${credit.id}`,
            title: credit.title,
            releaseDate: credit.release_date,
            posterPath: credit.poster_path || undefined
          },
          jobs: credit.jobs,
          characters: 'character' in credit ? credit.character.split(' / ') : undefined
        }))
      MovieDb.save()
    }
    return MovieDb.cache.personMovieCredits[id]
  }

  static async personInfo(id: Person['id']): Promise<ApiPerson> {
    if (!MovieDb.cache.personInfo[id]) {
      const person = await MovieDb.movieDbApi.personInfo({id})
      MovieDb.cache.personInfo[id] = convertPerson(person)
    }
    return MovieDb.cache.personInfo[id]
  }

  static async movieInfo(id: Movie['id']): Promise<ApiMovie> {
    if (!MovieDb.cache.movieInfo[id]) {
      const movie = await MovieDb.movieDbApi.movieInfo({id})
      MovieDb.cache.movieInfo[id] = convertMovie(movie)
      MovieDb.save()
    }
    return MovieDb.cache.movieInfo[id]
  }

  static async personCreditsForMovie(id: string, options?: { type?: 'Crew' | 'Cast' }): Promise<MovieCredit> {
    let crew: MovieCredit[] = MovieDb.cache.movieCrew[id];
    let cast: MovieCredit[] = MovieDb.cache.movieCast[id];

    let movieDbResponse: CreditsResponse;
    if (!options?.type || options?.type === 'Cast') {
      if ()
    }
  }

  static async movieCrew(id: Movie['id']): Promise<CrewCredit[]> {
    if (!MovieDb.cache.movieCrew[id]) {
      const {crew} = await MovieDb.movieDbApi.movieCredits(id) as { crew: Required<Crew>[] }
      const filteredCredits = filterInsignificantPeople(crew)
      const aggregatedCredits = aggregateAndNormalizeJobs(filteredCredits)
      MovieDb.cache.movieCrew[id] = aggregatedCredits
        .map(pickCrewCreditForMovieProperties)
        .sort(sortByRole)
      MovieDb.save()
    }
    return MovieDb.cache.movieCrew[id]
  }

  static async movieCast(id: Movie['id']): Promise<CastCredit[]> {
    if (!MovieDb.cache.movieCast[id]) {
      const {cast} = await MovieDb.movieDbApi.movieCredits(id) as { cast: Required<Cast>[] }
      MovieDb.cache.movieCast[id] = cast
        .map(pickCastCreditForMovieProperties)
        .sort((a, b) => a.order - b.order)
      MovieDb.save()
    }
    return MovieDb.cache.movieCast[id]
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
      const initial: Cache = {personInfo: {}, movieCrew: {}, movieCast: {}, personMovieCredits: {}, movieInfo: {}, allProviders: {}, movieProviders: {}}
      fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(initial))
    }
    return JSON.parse(fs.readFileSync(MovieDb.FILE_PATH, 'utf-8'))
  }
}

function filterInvalidMovies<T extends { vote_count: number, job: string }>(credits: T[]): T[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return credits.filter(movie => !!movie.vote_count && !ignoredRoles.includes(movie.job))
}

function aggregateAndNormalizeJobs<T extends { id: number }>(credits: (T & { job?: string })[]): (T & { jobs: string[] })[] {
  const creditsById: Record<number, any> = {}
  for (let credit of credits) {
    if (!credit.job) {
      continue
    }
    const normalizedRole = credit.job
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

    if (creditsById[credit.id]) {
      creditsById[credit.id].jobs.push(normalizedRole)
    } else {
      creditsById[credit.id] = {...credit, jobs: [normalizedRole]}
    }
  }
  return Object.values(creditsById)
}

function filterInsignificantPeople<T extends { job: string }>(crew: T[]): T[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return crew.filter(personCredit => !ignoredRoles.includes(personCredit.job))
}

function sortByRole(creditA: CrewCredit, creditB: CrewCredit): number {
  const jobsByImportance = [
    'Casting', 'Editor', 'Music', 'Sound', 'Producer', 'Cinematography', 'Writer', 'Director',
  ]
  const creditAPrecedence = Math.max(...creditA.jobs.map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  const creditBPrecedence = Math.max(...creditB.jobs.map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  return creditAPrecedence > creditBPrecedence ? -1 : 1
}

function pickCrewCreditForMovieProperties(credit: Pick<Crew, 'id' | 'name' | 'profile_path'> & { jobs: string[] }): CrewCredit {
  return {
    id: `${credit.id}`,
    name: credit.name || 'Name unknown',
    profilePath: credit.profile_path,
    jobs: credit.jobs,
  }
}

function pickCastCreditForMovieProperties(credit: Pick<Cast, 'id' | 'name' | 'profile_path' | 'character' | 'order'>): CastCredit {
  return {
    id: `${credit.id}`,
    name: credit.name || 'Name unknown',
    profilePath: credit.profile_path,
    character: credit.character || '',
    order: credit.order ?? 9999
  }
}

function pickMovieProperties(movie: Pick<MovieResponse, 'id' | 'imdb_id' | 'title' | 'poster_path' | 'release_date' | 'vote_average' | 'overview' | 'tagline'>): MovieInfo & { type: ThingType } {
  return {
    id: `${movie.id}`,
    imdbId: `${movie.imdb_id}`,
    title: movie.title!,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date || null,
    voteAverage: movie.vote_average!,
    overview: movie.overview!,
    tagline: movie.tagline || '',
    type: ThingType.Movie
  }
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

function pickPersonProperties(person: TmdbPerson): PersonWithoutFav & { type: ThingType } {
  return {
    id: `${person.id}`,
    name: person.name || 'Name unknown',
    biography: person.biography || '',
    knownForDepartment: person.known_for_department,
    profilePath: person.profile_path,
    type: ThingType.Person
  }
}
