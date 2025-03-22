import type { MovieResult, PersonResult, TvResult } from 'moviedb-promise'
import type { Movie, PersonInfo } from './graphql'

export type PersonWithoutFav = Omit<PersonInfo, 'favourited'>

export function isMovieSummary(result: Movie | PersonInfo): result is Movie {
  return result.__typename === 'Movie' ||  'releaseDate' in result
}

export function isMovieSearchResult(result: MovieResult | TvResult | PersonResult): result is MovieResult {
  return result.media_type === 'movie'
}

export function isPersonSearchResult(result: MovieResult | TvResult | PersonResult): result is PersonResult {
  return result.media_type === 'person'

}

export * from './graphql'
