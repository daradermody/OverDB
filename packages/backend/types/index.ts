import {Movie, Person} from "./graphql";
import { MovieResult, PersonResult, TvResult } from 'moviedb-promise'

export type PersonInfo = Omit<Person, 'favourited'>

export function isMovieSummary(result: Movie | Person): result is Movie {
  return 'releaseDate' in result
}

export function isPersonSummary(result: Movie | Person): result is Person {
  return 'biography' in result
}

export function isMovieSearchResult(result: MovieResult | TvResult | PersonResult): result is MovieResult {
  return result.media_type === 'movie'
}

export function isPersonSearchResult(result: MovieResult | TvResult | PersonResult): result is MovieResult {
  return result.media_type === 'person'

}

export interface User {
  id: number
  username: string
  avatarUrl: string
}

export * from './graphql'
