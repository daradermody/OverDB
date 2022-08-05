import {Resolvers} from "../generated/graphql";
import MovieDb from "../MovieDb";
import RottenTomatoes from '../RottenTomatoes';
import {UserData} from "../UserData";
import recommendedMoviesResolver from "./recommendedMovies";

export const USER_ID = 0

const index: Resolvers = {
  Movie: {
    sentiment: parent => UserData.getSentiment(USER_ID, parent.id),
    watched: parent => {
      return UserData.isWatched(USER_ID, parent.id)
    },
    inWatchlist: parent => UserData.inWatchlist(USER_ID, parent.id),
    tomatometer: ({title, releaseDate}) => {
      if (!releaseDate) {
        return null
      }
      const releaseYear = parseInt(releaseDate.split('-')[0], 10)
      return RottenTomatoes.getScore(title, releaseYear)
    }
  },
  MovieCredit: {
    sentiment: parent => UserData.getSentiment(USER_ID, parent.id),
    watched: parent => UserData.isWatched(USER_ID, parent.id),
    inWatchlist: parent => UserData.inWatchlist(USER_ID, parent.id),
  },
  Person: {
    favourited: (parent) => UserData.isFavourited(USER_ID, parent.id)
  },
  SearchResult: {
    __resolveType: (obj) => !!(obj as any).title ? 'Movie' : 'Person'
  },
  Query: {
    favouritePeople: () => Promise.all(UserData.getFavourites(USER_ID).map(MovieDb.personInfo)) as any,
    recommendedMovies: recommendedMoviesResolver as any,
    movie: (_, args) => MovieDb.movieInfo(args.id) as any,
    creditsForMovie: (_, args) => MovieDb.movieCredits(args.id),
    creditsForPerson: async (_, args) => {
      const credits = await MovieDb.personMovieCredits(args.id)
      return Promise.all(credits.map(async credit => ({
        ...(await MovieDb.movieInfo(credit.id)),
        ...credit
      }))) as any
    },
    search: (_, args) => MovieDb.search(args.query) as any,
    person: (_, args) => MovieDb.personInfo(args.id) as any,
    watchlist: () => Promise.all(UserData.getWatchlist(USER_ID).map(MovieDb.movieInfo)) as any,
    watched: async (_, args) => {
      const offset = args.offset || 0
      const watchedMovieIds = UserData.getWatched(USER_ID)
      const movieIds = watchedMovieIds.slice(offset, offset + args.limit || undefined)
      return {
        offset: offset,
        limit: args.limit,
        endReached: !args.limit || offset + args.limit >= watchedMovieIds.length,
        results: await Promise.all(movieIds.map(MovieDb.movieInfo)) as any
      }
    },
  },
  Mutation: {
    setFavourite: (_, args) => {
      UserData.setFavourite(USER_ID, args.id, args.favourited)
      return MovieDb.personInfo(args.id) as any
    },
    setWatched: (_, args) => {
      UserData.setWatched(USER_ID, args.id, args.watched)
      return MovieDb.movieInfo(args.id) as any
    },
    setInWatchlist: (_, args) => {
      UserData.setInWatchlist(USER_ID, args.id, args.inWatchlist)
      return MovieDb.movieInfo(args.id) as any
    },
    setSentiment: (_, args) => {
      UserData.setSentiment(USER_ID, args.id, args.sentiment)
      return MovieDb.movieInfo(args.id) as any
    }
  }
}

export default index
