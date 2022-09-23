import { Movie, User } from '../../types'
import MovieDb from '../services/MovieDb'
import { UserData } from '../services/UserData'

export default async function recommendedMoviesResolver(userId: User['id']): Promise<Movie[]> {
  const peopleIds = UserData.getFavourites(userId)
  const creditsForPeople = await Promise.all(peopleIds.map(MovieDb.personMovieCredits))
  const acknowledgedMovies = new Set([...UserData.getWatched(userId), ...UserData.getWatchlist(userId)])

  const movieIds: string[] = []
  for (const creditsForPerson of creditsForPeople) {
    const moviesUnheardForPerson = creditsForPerson.filter(m => !acknowledgedMovies.has(m.id))
    movieIds.push(...moviesUnheardForPerson.map(m => m.id))
  }

  const filteredMovieIds = Array.from(new Set(movieIds))
    .sort(() => Math.random() - 0.5)
    .slice(0, 18)

  return await Promise.all(filteredMovieIds.map(MovieDb.movieInfo)) as any
}
