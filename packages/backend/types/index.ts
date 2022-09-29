import {Movie, Person} from "./graphql";

export type PersonInfo = Omit<Person, 'favourited'>

export function isMovieSummary(result: any): result is Movie {
  return !!(result as any).title
}

export function isPersonSummary(result: any): result is Person {
  return !!(result as any).name
}

export interface User {
  id: number
  username: string
  avatarUrl: string
}

export * from './graphql'
