import MovieDb from '../services/MovieDb'
import {UserData} from '../services/UserData'
import type {MovieWithUserMetadata} from '../apiTypes.ts'

export default async function recommendedMoviesResolver(username: string, maxSize: number): Promise<MovieWithUserMetadata[]> {
  const acknowledgedMovies = new Set([...UserData.getWatched(username), ...UserData.getWatchlist(username)])
  const recommendations = await getRecommendations(username, Math.round(maxSize / 4))

  return recommendations
    .filter(movie => !acknowledgedMovies.has(movie.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, maxSize)
}

async function getRecommendations(username: string, numberOfInputs: number): Promise<MovieWithUserMetadata[]> {
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

  return uniqById(movies)
    .map(movie => UserData.addUserMetadataToMovie(username, movie))
}

function uniqById<T extends {id: string}>(items: T[]): T[] {
  const itemsById: Record<string, T> = {}
  for (const item of items) {
    itemsById[item.id] = item
  }
  return Object.values(itemsById)
}
