import { MovieInfo } from '../../types'
import MovieDb from '../services/MovieDb'
import { UserData } from '../services/UserData'
import { User } from '../services/users'

export default async function recommendedMoviesResolver(username: User['username'], maxSize: number): Promise<MovieInfo[]> {
  const acknowledgedMovies = new Set([...UserData.getWatched(username), ...UserData.getWatchlist(username)])
  const recommendations = await getRecommendations(username, Math.round(maxSize / 4))

  return recommendations
    .filter(movie => !acknowledgedMovies.has(movie.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, maxSize)
}

async function getRecommendations(username: User['username'], numberOfInputs: number) {
  const favouritePeople = UserData.getFavourites(username)
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfInputs)
  const numExtraMovies = Math.max(favouritePeople.length - numberOfInputs, 0)

  const likedMovies = UserData.getLikedMovies(username)
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfInputs)
  const numExtraPeople = Math.max(likedMovies.length - numberOfInputs, 0)

  const numPeople = Math.round(numberOfInputs + numExtraPeople)
  const numMovies = Math.round(numberOfInputs + numExtraMovies)
  const movies = (await Promise.all([
    MovieDb.discoverBasedOnPeople(favouritePeople.slice(0, numPeople)),
    MovieDb.discoverBasedOnMovies(likedMovies.slice(0, numMovies))
  ])).flat()

  const moviesById: Record<MovieInfo['id'], MovieInfo> = {}
  for (const movie of movies) {
    moviesById[movie.id] = movie
  }
  return Object.values(moviesById)
}
