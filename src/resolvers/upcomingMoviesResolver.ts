import { MovieInfo } from '../../types'
import MovieDb from '../services/MovieDb'
import { UserData } from '../services/UserData'
import { User } from '../services/users'
import {sortMoviesByReleaseDateDesc} from '../utils/sorting';

export default async function upcomingMoviesResolver(username: User['username']): Promise<MovieInfo[]> {
  const peopleIds = UserData.getFavourites(username)
  const creditsForPeople = await Promise.all(peopleIds.map(MovieDb.getPersonCredits))

  const now = new Date()
  const movieIds: string[] = []
  for (const creditsForPerson of creditsForPeople) {
    const upcomingMovies = creditsForPerson
      .filter(m => !m.releaseDate || new Date(m.releaseDate) > now)
    movieIds.push(...upcomingMovies.map(m => m.id))
  }

  const movies = await Promise.all(movieIds.map(MovieDb.movieInfo))
  return movies.sort(sortMoviesByReleaseDateDesc)
}
