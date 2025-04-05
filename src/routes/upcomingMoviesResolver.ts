import type { MovieSummary } from '../apiTypes.ts'
import MovieDb from '../services/MovieDb'
import { UserData } from '../services/UserData'
import { sortMoviesByReleaseDateDesc } from '../utils/sorting'

export default async function upcomingMoviesResolver(username: string): Promise<MovieSummary[]> {
  const peopleIds = UserData.getFavourites(username)
  const creditsForPeople = await Promise.all(peopleIds.map(MovieDb.getPersonCredits))

  const now = new Date()
  const upcomingMoviesById: Record<string, MovieSummary> = {}
  for (const creditsForPerson of creditsForPeople) {
    creditsForPerson
      .filter(credit => !credit.movie.releaseDate || new Date(credit.movie.releaseDate) > now)
      .forEach(credit => upcomingMoviesById[credit.movie.id] = credit.movie)
  }

  return Object.values(upcomingMoviesById).sort(sortMoviesByReleaseDateDesc)
}
