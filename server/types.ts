import {Movie, Person} from "./generated/graphql";

export type PersonInfo = Omit<Person, 'favourited'>
export type MovieInfo = Omit<Movie, 'watched' | 'inWatchlist' | 'sentiment'>

export function isMovieSummary(result: any): result is Movie {
  return !!(result as any).title
}

export function isPersonSummary(result: any): result is Person {
  return !!(result as any).name
}
