import {Movie, Resolvers} from "../generated/graphql";
import MovieDb from "../MovieDb";
import {MovieInfo} from "../types";
import {UserData} from "../UserData";
import {USER_ID} from "./index";

const recommendedMoviesResolver: Resolvers['Query']['recommendedMovies'] = async (): Promise<Movie[]> => {
  const userId = USER_ID
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

export default recommendedMoviesResolver
