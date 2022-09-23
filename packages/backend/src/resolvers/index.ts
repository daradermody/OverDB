import {
  Movie,
  MovieCredit,
  MutationSetFavouriteArgs,
  MutationSetInWatchlistArgs,
  MutationSetSentimentArgs,
  MutationSetWatchedArgs,
  Person,
  QueryCreditsForMovieArgs,
  QueryCreditsForPersonArgs,
  QueryMovieArgs,
  QueryPersonArgs, QuerySearchArgs,
  QueryWatchedArgs,
  Resolvers,
  SearchResult,
  User
} from '../../types'
import MovieDb from '../services/MovieDb'
import RottenTomatoes from '../services/RottenTomatoes'
import { UserData } from '../services/UserData'
import recommendedMoviesResolver from './recommendedMovies'
import { isMovieSummary } from '../../types'

const index: Resolvers<{user: User}> = {
  Movie: {
    sentiment: (parent, _, {user}) => UserData.getSentiment(user.id, parent.id),
    watched: (parent, _, {user}) => UserData.isWatched(user.id, parent.id),
    inWatchlist: (parent, _, {user}) => UserData.inWatchlist(user.id, parent.id),
    tomatometer: ({title, releaseDate}, _, {user}) => {
      if (!releaseDate) {
        return null
      }
      const releaseYear = parseInt(releaseDate.split('-')[0], 10)
      return RottenTomatoes.getScore(title, releaseYear)
    }
  },
  MovieCredit: {
    sentiment: (parent: MovieCredit, _, {user}) => UserData.getSentiment(user.id, parent.id),
    watched: (parent: MovieCredit, _, {user}) => UserData.isWatched(user.id, parent.id),
    inWatchlist: (parent: MovieCredit, _, {user}) => UserData.inWatchlist(user.id, parent.id),
  },
  Person: {
    favourited: (parent: Person, _, {user}) => UserData.isFavourited(user.id, parent.id)
  },
  SearchResult: {
    __resolveType: (obj: SearchResult) => isMovieSummary(obj) ? 'Movie' : 'Person'
  },
  Query: {
    favouritePeople: (_1, _2, {user}) => Promise.all(UserData.getFavourites(user.id).map(MovieDb.personInfo)) as any,
    recommendedMovies: (_1, _2, {user}) => recommendedMoviesResolver(user.id),
    movie: (_: any, args: QueryMovieArgs) => MovieDb.movieInfo(args.id) as any,
    creditsForMovie: (_: any, args: QueryCreditsForMovieArgs) => MovieDb.movieCredits(args.id),
    creditsForPerson: async (_: any, args: QueryCreditsForPersonArgs) => {
      try {
        const credits = await MovieDb.personMovieCredits(args.id)
        return Promise.all(credits.map(async credit => ({
          ...(await MovieDb.movieInfo(credit.id)),
          ...credit
        }))) as any
      } catch (e) {
        console.error(e)
      }
    },
    search: (_: any, args: QuerySearchArgs) => MovieDb.search(args.query) as any,
    person: (_: any, args: QueryPersonArgs) => MovieDb.personInfo(args.id) as any,
    watchlist: (_1, _2, {user}) => Promise.all(UserData.getWatchlist(user.id).map(MovieDb.movieInfo)) as any,
    watched: async (_: any, args: QueryWatchedArgs, {user}) => {
      const offset = args.offset || 0
      const limit = args.limit || 10
      const watchedMovieIds = UserData.getWatched(user.id)
      const movieIds = watchedMovieIds.slice(offset, offset + limit)
      return {
        offset,
        limit,
        endReached: !args.limit || offset + args.limit >= watchedMovieIds.length,
        results: await Promise.all(movieIds.map(MovieDb.movieInfo)) as any
      }
    },
  },
  Mutation: {
    setFavourite: (_, args: MutationSetFavouriteArgs, {user}) => {
      UserData.setFavourite(user.id, args.id, args.favourited)
      return MovieDb.personInfo(args.id) as any
    },
    setWatched: (_, args: MutationSetWatchedArgs, {user}) => {
      UserData.setWatched(user.id, args.id, args.watched)
      return MovieDb.movieInfo(args.id) as any
    },
    setInWatchlist: (_, args: MutationSetInWatchlistArgs, {user}) => {
      UserData.setInWatchlist(user.id, args.id, args.inWatchlist)
      return MovieDb.movieInfo(args.id) as any
    },
    setSentiment: (_, args: MutationSetSentimentArgs, {user}) => {
      UserData.setSentiment(user.id, args.id, args.sentiment)
      return MovieDb.movieInfo(args.id) as any
    }
  }
}

export default index