import BaseRoutes from "./BaseRoutes";
import {UserData} from "../UserData";
import MovieDb from "../MovieDb";
import {LikableMovie} from "../types";

class RecommendationRoutes extends BaseRoutes {
  setupRoutes() {
    this.get<LikableMovie[]>('/movies', async () => {
      const peopleIds = UserData.getFavourites(0)
      const creditsForPeople = await Promise.all(peopleIds.map(MovieDb.personMovieCredits))
      const acknowledgedMovies = new Set([...UserData.getWatched(0), ...UserData.getWatchlist(0)])

      const movieIds: number[] = []
      for (const creditsForPerson of creditsForPeople) {
        const moviesUnheardForPerson = creditsForPerson.filter(m => !acknowledgedMovies.has(m.id))
        movieIds.push(...moviesUnheardForPerson.map(m => m.id))
      }

      const filteredMovieIds = Array.from(new Set(movieIds))
        .sort(() => Math.random() - 0.5)
        .slice(0, 18)
      const moviesUnheard = await Promise.all(filteredMovieIds.map(MovieDb.movieInfo))
      return moviesUnheard.map(movie => ({
        ...movie,
        sentiment: UserData.getSentiment(0, movie.id),
        watched: UserData.isWatched(0, movie.id),
        inWatchlist: UserData.inWatchlist(0, movie.id),
      }))
    })
  }
}

export default new RecommendationRoutes().router
