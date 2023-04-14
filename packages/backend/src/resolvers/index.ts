import { GraphQLError } from 'graphql/error'
import { GraphQLResolveInfo } from 'graphql/type'
import {
  isMovieSummary,
  Movie,
  MovieCredit,
  MutationSetFavouriteArgs,
  MutationSetInWatchlistArgs,
  MutationSetSentimentArgs,
  MutationSetWatchedArgs,
  PersonWithoutFav,
  Query,
  QueryCastForMovieArgs,
  QueryCreditsForPersonArgs,
  QueryCrewForMovieArgs,
  QueryMovieArgs,
  QueryPersonArgs,
  QueryRecommendedMoviesArgs,
  QuerySearchArgs,
  QueryTrendingArgs,
  QueryWatchedArgs,
  ResolverFn,
  Resolvers,
  SearchResult,
  User
} from '../../types'
import MovieDb from '../services/MovieDb'
import RottenTomatoes from '../services/RottenTomatoes'
import { UserData } from '../services/UserData'
import recommendedMoviesResolver from './recommendedMovies'
import upcomingMoviesResolver from './upcomingMoviesResolver'

const unauthedQueries: (keyof Query)[] = ['trending']
const index: Resolvers<{ user: User }> = {
  Movie: {
    sentiment: (parent, _, {user}) => UserData.getSentiment(user.id, parent.id),
    watched: (parent, _, {user}) => UserData.isWatched(user.id, parent.id),
    inWatchlist: (parent, _, {user}) => UserData.inWatchlist(user.id, parent.id),
    tomatometer: ({title, releaseDate}) => {
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
  PersonInfo: {
    favourited: (parent: PersonWithoutFav, _, {user}) => UserData.isFavourited(user.id, parent.id)
  },
  SearchResult: {
    __resolveType: (obj: SearchResult) => isMovieSummary(obj) ? 'Movie' : 'PersonInfo'
  },
  Query: applyAuth({
    favouritePeople: (_1, _2, {user}) => Promise.all(UserData.getFavourites(user.id).slice().reverse().map(MovieDb.personInfo)) as any,
    recommendedMovies: (_1, args: QueryRecommendedMoviesArgs, {user}) => recommendedMoviesResolver(user.id, args.size || 18) as unknown as Promise<Movie[]>,
    movie: (_, args: QueryMovieArgs) => MovieDb.movieInfo(args.id) as any,
    crewForMovie: (_, args: QueryCrewForMovieArgs) => MovieDb.movieCrew(args.id),
    castForMovie: (_, args: QueryCastForMovieArgs) => MovieDb.movieCast(args.id),
    creditsForPerson: async (_, args: QueryCreditsForPersonArgs) => {
      try {
        const credits = await MovieDb.personMovieCredits(args.id)
        return await Promise.all(credits.map(async credit => ({
          ...(await MovieDb.movieInfo(credit.id)),
          ...credit
        }))) as any
      } catch (e) {
        console.error(e)
      }
    },
    search: (_, args: QuerySearchArgs) => MovieDb.search(args.query) as any,
    person: (_, args: QueryPersonArgs) => MovieDb.personInfo(args.id) as any,
    watchlist: (_1, _2, {user}) => Promise.all(UserData.getWatchlist(user.id).slice().reverse().map(MovieDb.movieInfo)) as any,
    likedMovies: (_1, _2, {user}) => Promise.all(UserData.getLikedMovies(user.id).slice().reverse().map(MovieDb.movieInfo)) as any,
    watched: async (_, args: QueryWatchedArgs, {user}) => {
      const offset = args.offset || 0
      const limit = args.limit || 10
      const watchedMovieIds = UserData.getWatched(user.id).slice().reverse()
      const movieIds = watchedMovieIds.slice(offset, offset + limit)
      return {
        offset,
        limit,
        endReached: !args.limit || offset + limit >= watchedMovieIds.length,
        results: await Promise.all(movieIds.map(MovieDb.movieInfo)) as any
      }
    },
    trending: (_, args: QueryTrendingArgs) => MovieDb.trending(args.size || 12),
    profileCounts: async (_1: any, _2: any, {user}) => {
      const [people, watched, liked, watchlist] = await Promise.all([
        UserData.getFavourites(user.id), UserData.getWatched(user.id), UserData.getLikedMovies(user.id), UserData.getWatchlist(user.id)
      ])
      return {favouritePeople: people.length, watched: watched.length, moviesLiked: liked.length, watchlist: watchlist.length}
    },
    upcoming: async (_1, _2, {user}) => await upcomingMoviesResolver(user.id) as any
  }),
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

function applyAuth<TResult, TParent, TContext, TArgs>(resolvers: Resolvers['Query']): Resolvers['Query'] {
  if (!resolvers) return resolvers

  const authedResolvers: Resolvers['Query'] = {}
  for (const [queryName, resolver] of Object.entries(resolvers)) {
    authedResolvers[queryName] = unauthedQueries.includes(queryName as keyof Query) ? resolver : withUser(resolver)
  }
  return authedResolvers
}

function withUser<TResult, TParent, TContext extends { user?: User }, TArgs>(resolver: ResolverFn<TResult, TParent, TContext, TArgs>): ResolverFn<TResult, TParent, TContext, TArgs> {
  return (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo): TResult | Promise<TResult> => {
    if (!context.user) {
      throw new GraphQLError('You must be logged in', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: {status: 401},
        },
      })
    }
    return resolver(parent, args, context, info)
  }
}

export default index
