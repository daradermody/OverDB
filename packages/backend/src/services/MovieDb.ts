import axios from 'axios'
import * as fs from 'fs'
import { Cast, MovieDb as MovieDbApi } from 'moviedb-promise'
import { Crew, MovieResponse, Person as TmdbPerson, PersonMovieCreditsResponse } from 'moviedb-promise/dist/request-types'
import { CastCredit, CrewCredit, isMovieSearchResult, isPersonSearchResult, Movie, MovieCredit, MovieInfo, Person, PersonWithoutFav } from '../../types'
import getToken from '../utils/getToken'
import { dataDir } from './dataStorage'

interface Cache {
  movieInfo: {
    [id: Movie['id']]: MovieInfo;
  }
  movieCrew: {
    [id: Movie['id']]: CrewCredit[];
  }
  movieCast: {
    [id: Movie['id']]: CastCredit[];
  }
  personMovieCredits: {
    [id: Person['id']]: Pick<MovieCredit, 'id' | 'title' | 'jobs' | 'character'>[];
  }
  personInfo: {
    [id: Person['id']]: PersonWithoutFav
  },
}

const key = getToken('TMDB_TOKEN')

export default class MovieDb {
  static FILE_PATH = `${dataDir}/moviedb_cache.json`
  private static movieDbApi = new MovieDbApi(key)
  private static cache: Cache = MovieDb.readCache()

  static async personMovieCredits(id: Person['id']): Promise<Pick<MovieCredit, 'id' | 'title' | 'jobs' | 'character'>[]> {
    if (!MovieDb.cache.personMovieCredits[id]) {
      const {data} = await axios.get<PersonMovieCreditsResponse>(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${key}`)
      const crew = data.crew as Required<NonNullable<PersonMovieCreditsResponse['crew']>[0]>[]
      const cast = data.cast as Required<NonNullable<PersonMovieCreditsResponse['cast']>[0]>[]
      const crewMovies = filterInvalidMovies(crew)
      const castMovies = cast.map(c => ({...c, job: 'Actor'}))
      const movies = aggregateAndNormalizeJobs([...castMovies, ...crewMovies])
      MovieDb.cache.personMovieCredits[id] = movies
        .sort((m1, m2) => m1.release_date < m2.release_date ? 1 : -1)
        .map(m => {
          const movie: Pick<MovieCredit, 'id' | 'title' | 'jobs' | 'character'> = {id: `${m.id}`, jobs: m.jobs, title: m.title}
          if ('character' in m) {
            movie.character = m.character
          }
          return movie
        })
      MovieDb.save()
        .catch(console.error)
    }
    return MovieDb.cache.personMovieCredits[id]
  }

  static async personInfo(id: Person['id']): Promise<PersonWithoutFav> {
    if (!MovieDb.cache.personInfo[id]) {
      const {data: person} = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${key}`)
      MovieDb.cache.personInfo[id] = pickPersonProperties(person)
    }
    return MovieDb.cache.personInfo[id]
  }

  static async movieInfo(id: Movie['id']): Promise<MovieInfo> {
    if (!MovieDb.cache.movieInfo[id]) {
      const {data: movie} = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}`)
      MovieDb.cache.movieInfo[id] = pickMovieProperties(movie)
      MovieDb.save()
        .catch(console.error)
    }
    return MovieDb.cache.movieInfo[id]
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
        .catch(console.error)
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
        .catch(console.error)
    }
    return MovieDb.cache.movieCast[id]
  }

  static async search(query: string): Promise<(MovieInfo | PersonWithoutFav)[]> {
    const {results} = await this.movieDbApi.searchMulti({query})
    return results!
      .filter(result => isMovieSearchResult(result) || isPersonSearchResult(result))
      .map(result => isMovieSearchResult(result) ? pickMovieProperties(result) : pickPersonProperties(result))
  }

  static async trending(): Promise<MovieInfo[]> {
    const {results} = await this.movieDbApi.trending({time_window: 'week', media_type: 'movie'})
    return results!
      .map(pickMovieProperties)
      .slice(0, 12)
  }

  static async save(): Promise<void> {
    fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(MovieDb.cache))
  }

  private static readCache(): Cache {
    if (!fs.existsSync(MovieDb.FILE_PATH)) {
      const initial: Cache = {personInfo: {}, movieCrew: {}, movieCast: {}, personMovieCredits: {}, movieInfo: {}}
      fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(initial))
    }
    return JSON.parse(fs.readFileSync(MovieDb.FILE_PATH, 'utf-8'))
  }
}

function filterInvalidMovies<T extends { vote_count: number, job: string }>(credits: T[]): T[] {
  const ignoredRoles = ['Thanks', 'Characters']
  return credits.filter(movie => !!movie.vote_count && !ignoredRoles.includes(movie.job))
}

function aggregateAndNormalizeJobs<T extends { id: number }>(credits: (T & { job: string })[]): (T & { jobs: string[] })[] {
  const creditsById: Record<number, any> = {}
  for (let credit of credits) {
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

function pickMovieProperties(movie: MovieResponse): MovieInfo {
  return {
    id: `${movie.id}`,
    title: movie.title!,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average!,
    overview: movie.overview!,
    tagline: movie.tagline || '',
  }
}

function pickPersonProperties(person: TmdbPerson): PersonWithoutFav {
  return {
    id: `${person.id}`,
    name: person.name || 'Name unknown',
    biography: person.biography || '',
    knownForDepartment: person.known_for_department,
    profilePath: person.profile_path,
  }
}
