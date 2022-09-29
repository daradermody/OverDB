import * as fs from 'fs'
import { MovieDb as MovieDbApi } from 'moviedb-promise'
import { Crew, MovieResponse, Person as TmdbPerson, PersonMovieCreditsResponse } from 'moviedb-promise/dist/request-types'
import { isMovieSummary, isPersonSummary, Movie, MovieCredit, MovieInfo, Person, PersonCredit, PersonInfo } from '../../types'
import axios from 'axios'
import getToken from '../utils/getToken'
import { dataDir } from './dataStorage'

interface Cache {
  movieInfo: {
    [id: Movie['id']]: MovieInfo;
  }
  movieCredits: {
    [id: Movie['id']]: PersonCredit[];
  }
  personMovieCredits: {
    [id: Person['id']]: {
      id: MovieCredit['id']
      title: MovieCredit['title']
      jobs: MovieCredit['jobs']
    }[];
  }
  personInfo: {
    [id: Person['id']]: PersonInfo
  },
}

const key = getToken('TMDB_TOKEN')

export default class MovieDb {
  private static movieDbApi = new MovieDbApi(key)
  static FILE_PATH = `${dataDir}/moviedb_cache.json`
  private static cache: Cache = MovieDb.readCache()

  private static readCache(): Cache {
    if (!fs.existsSync(MovieDb.FILE_PATH)) {
      const initial: Cache = {personInfo: {}, movieCredits: {}, personMovieCredits: {}, movieInfo: {}}
      fs.writeFileSync(MovieDb.FILE_PATH, JSON.stringify(initial))
    }
    return JSON.parse(fs.readFileSync(MovieDb.FILE_PATH, 'utf-8'))
  }

  static async personMovieCredits(id: Person['id']): Promise<{ id: MovieCredit['id'], title: MovieCredit['title'], jobs: MovieCredit['jobs'] }[]> {
    if (!MovieDb.cache.personMovieCredits[id]) {
      const {data} = await axios.get<PersonMovieCreditsResponse>(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${key}`)
      const crew = data.crew as Required<NonNullable<PersonMovieCreditsResponse['crew']>[0]>[]
      const filteredMovies = filterInvalidMovies(crew)
      MovieDb.cache.personMovieCredits[id] = aggregateAndNormalizeJobs(filteredMovies)
        .map(m => ({id: `${m.id}`, jobs: m.jobs, title: m.title}))
      MovieDb.save()
        .catch(console.error)
    }
    return MovieDb.cache.personMovieCredits[id]
  }

  static async personInfo(id: Person['id']): Promise<PersonInfo> {
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

  static async movieCredits(id: Movie['id']): Promise<PersonCredit[]> {
    if (!MovieDb.cache.movieCredits[id]) {
      const {crew} = await MovieDb.movieDbApi.movieCredits(id) as { crew: Required<Crew>[] }
      const filteredCredits = filterInsignificantPeople(crew)
      const aggregatedCredits = aggregateAndNormalizeJobs(filteredCredits)
      MovieDb.cache.movieCredits[id] = aggregatedCredits
        .map(pickPersonCreditForMovieProperties)
        .sort(sortByRole)
      MovieDb.save()
        .catch(console.error)
    }
    return MovieDb.cache.movieCredits[id]
  }

  static async search(query: string): Promise<(MovieInfo | PersonInfo)[]> {
    const {results} = await this.movieDbApi.searchMulti({query})
    return results!
      .filter(result => isMovieSummary(result) || isPersonSummary(result))
      .map(result => {
        if (isMovieSummary(result)) {
          return pickMovieProperties(result)
        } else {
          return pickPersonProperties(result)
        }
      })
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
      .replace('Co-Producer', 'Producer')
      .replace('Assistant Director', 'Music')
      .replace('Music Producer', 'Music')
      .replace('Orchestrator', 'Music')
      .replace('Conductor', 'Music')
      .replace('Original Music Composer', 'Music')
      .replace('Sound Designer', 'Sound')
      .replace('Screenplay', 'Writer')
      .replace('Scenario Writer', 'Writer')
      .replace('Theatre Play', 'Writer')
      .replace('Story', 'Writer')
      .replace('Author', 'Writer')
      .replace('Technical Advisor', 'Advisor')
      .replace('Script Consultant', 'Advisor')
      .replace('Camera Operator', 'Cameras')
      .replace('Director of Photography', 'Cinematography')

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

function sortByRole(creditA: PersonCredit, creditB: PersonCredit): number {
  const jobsByImportance = [
    'Casting',
    'Editor',
    'Music',
    'Sound',
    'Producer',
    'Cinematography',
    'Writer',
    'Director',
  ]
  const creditAPrecedence = Math.max(...creditA.jobs.map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  const creditBPrecedence = Math.max(...creditB.jobs.map(job => jobsByImportance.findIndex(importantJob => job === importantJob)))
  return creditAPrecedence > creditBPrecedence ? -1 : 1
}

function pickPersonCreditForMovieProperties(credit: Pick<Crew, 'id' | 'name' | 'profile_path'> & { jobs: string[] }): PersonCredit {
  return {
    id: `${credit.id}`,
    name: credit.name || 'Name unknown',
    profilePath: credit.profile_path,
    jobs: credit.jobs,
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
    tagline: movie.tagline || '', // TODO: Fix
  }
}

function pickPersonProperties(person: TmdbPerson): PersonInfo {
  return ({
    id: `${person.id}`,
    name: person.name || 'Name unknown',
    biography: person.biography,
    knownForDepartment: person.known_for_department,
    profilePath: person.profile_path,
  })
}
