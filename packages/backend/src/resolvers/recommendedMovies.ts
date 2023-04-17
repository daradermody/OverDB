import { MovieInfo, User } from '../../types'
import MovieDb from '../services/MovieDb'
import { UserData } from '../services/UserData'

export default async function recommendedMoviesResolver(userId: User['id'], maxSize: number): Promise<MovieInfo[]> {
  const acknowledgedMovies = new Set([...UserData.getWatched(userId), ...UserData.getWatchlist(userId)])
  const recommendations = await getRecommendations(userId, Math.round(maxSize / 4))

  return recommendations
    .filter(movie => !acknowledgedMovies.has(movie.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, maxSize)
}

async function getRecommendations(userId: User['id'], numberOfInputs: number) {
  const favouritePeople = UserData.getFavourites(userId)
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfInputs)
  const numExtraMovies = Math.max(favouritePeople.length - numberOfInputs, 0)

  const likedMovies = UserData.getLikedMovies(userId)
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfInputs)
  const numExtraPeople = Math.max(likedMovies.length - numberOfInputs, 0)

  const numPeople = Math.round(numberOfInputs + numExtraPeople)
  const numMovies = Math.round(numberOfInputs + numExtraMovies)
  return (await Promise.all([
    MovieDb.discoverBasedOnPeople(favouritePeople.slice(0, numPeople)),
    MovieDb.discoverBasedOnMovies(likedMovies.slice(0, numMovies))
  ])).flat()
}
