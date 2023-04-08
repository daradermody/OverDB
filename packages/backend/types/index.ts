import { MovieResult, PersonResult, TvResult } from 'moviedb-promise'
import { Movie, PersonInfo } from './graphql'

export type PersonWithoutFav = Omit<PersonInfo, 'favourited'>

export function isMovieSummary(result: Movie | PersonInfo): result is Movie {
  return 'releaseDate' in result
}

export function isPersonSummary(result: Movie | PersonInfo): result is PersonInfo {
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
