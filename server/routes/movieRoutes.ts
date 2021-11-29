import MovieDb from "../MovieDb";
import BaseRoutes from "./BaseRoutes";
import {UserData} from "../UserData";
import {LikableMovie, Movie, PersonCreditForMovie, Sentiment} from "../types";

class MovieRoutes extends BaseRoutes {
  setupRoutes() {
    this.get<LikableMovie>('/:id', async req => {
      const id = parseInt(req.params.id)
      return {
        ...await MovieDb.movieInfo(id),
        sentiment: UserData.getSentiment(0, id),
        watched: UserData.isWatched(0, id),
        inWatchlist: UserData.inWatchlist(0, id),
      }
    })

    this.get<PersonCreditForMovie[]>('/:id/cast', req => {
      return MovieDb.movieCredits(parseInt(req.params.id))
    })

    this.post<void>('/:id/sentiment/:sentiment', req => {
      if (!Object.values(Sentiment).includes(req.params.sentiment)) {
        throw new Error(`Sentiment "${req.params.sentiment}" must be one of ${Object.values(Sentiment)}`)
      }
      UserData.setSentiment(0, parseInt(req.params.id), req.params.sentiment)
    })

    this.put<void>('/:id/watchlist', req => {
      UserData.setInWatchlist(0, parseInt(req.params.id), true)
    })

    this.delete<void>('/:id/watchlist', req => {
      UserData.setInWatchlist(0, parseInt(req.params.id), false)
    })

    this.put<void>('/:id/watched', req => {
      UserData.setWatched(0, parseInt(req.params.id), true)
    })

    this.delete<void>('/:id/watched', req => {
      UserData.setWatched(0, parseInt(req.params.id), false)
    })
  }
}

export default new MovieRoutes().router
