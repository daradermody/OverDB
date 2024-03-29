import { MovieInfo } from '../../types'
import MovieDb from '../services/MovieDb'
import { UserData } from '../services/UserData'
import { User } from '../services/users'

export default async function upcomingMoviesResolver(username: User['username']): Promise<MovieInfo[]> {
  const peopleIds = UserData.getFavourites(username)
  const creditsForPeople = await Promise.all(peopleIds.map(MovieDb.personMovieCredits))

  const now = new Date()
  const movieIds: string[] = []
  for (const creditsForPerson of creditsForPeople) {
    const upcomingMovies = creditsForPerson
      .filter(m => !m.releaseDate || new Date(m.releaseDate) > now)
    movieIds.push(...upcomingMovies.map(m => m.id))
  }

  const movies = await Promise.all(movieIds.map(MovieDb.movieInfo))
  return movies.sort((a, b) => {
    if (a.releaseDate && b.releaseDate) {
      return new Date(a.releaseDate) < new Date(b.releaseDate) ? -1 : 1
    } else if (a.releaseDate || b.releaseDate) {
      return a.releaseDate ? -1 : 1
    } else {
      return a.posterPath ? -1 : 1
    }
  })
}
