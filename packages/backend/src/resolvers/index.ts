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
  PaginatedMovies,
  PaginatedPeople,
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
  QueryUserArgs,
  ResolverFn,
  Resolvers,
  SearchResult,
} from '../../types'
import MovieDb from '../services/MovieDb'
import RottenTomatoes from '../services/RottenTomatoes'
import { UserData } from '../services/UserData'
import { getUser, getUsers, User } from '../services/users'
import { paginate } from './pagination'
import recommendedMoviesResolver from './recommendedMovies'
import upcomingMoviesResolver from './upcomingMoviesResolver'

const unauthedQueries: (keyof Query)[] = ['trending']
const index: Resolvers<{ user: User }> = {
  Movie: {
    sentiment: (parent, _, {user}) => UserData.getSentiment(user.username, parent.id),
    watched: (parent, _, {user}) => UserData.isWatched(user.username, parent.id),
    inWatchlist: (parent, _, {user}) => UserData.inWatchlist(user.username, parent.id),
    tomatometer: ({title, releaseDate}) => {
      if (!releaseDate) {
        return null
      }
      const releaseYear = parseInt(releaseDate.split('-')[0], 10)
      return RottenTomatoes.getScore(title, releaseYear)
    }
  },
  MovieCredit: {
    sentiment: (parent: MovieCredit, _, {user}) => UserData.getSentiment(user.username, parent.id),
    watched: (parent: MovieCredit, _, {user}) => UserData.isWatched(user.username, parent.id),
    inWatchlist: (parent: MovieCredit, _, {user}) => UserData.inWatchlist(user.username, parent.id),
  },
  PersonInfo: {
    favourited: (parent: PersonWithoutFav, _, {user}) => UserData.isFavourited(user.username, parent.id)
  },
  User: {
    favouritePeople: (parent, args) => {
      const ids = UserData.getFavourites(parent.username).slice().reverse()
      return paginate(ids, MovieDb.personInfo, args.offset, args.limit) as Promise<PaginatedPeople>
    },
    watchlist: (parent, args) => {
      const ids = UserData.getWatchlist(parent.username).slice().reverse()
      return paginate(ids, MovieDb.movieInfo, args.offset, args.limit) as Promise<PaginatedMovies>
    },
    likedMovies: (parent, args) => {
      const ids = UserData.getLikedMovies(parent.username).slice().reverse()
      return paginate(ids, MovieDb.movieInfo, args.offset, args.limit) as Promise<PaginatedMovies>
    },
    watched: (parent, args) => {
      const ids = UserData.getWatched(parent.username).slice().reverse()
      return paginate(ids, MovieDb.movieInfo, args.offset, args.limit) as Promise<PaginatedMovies>
    },
    stats: async (parent) => {
      const [people, watched, liked, watchlist] = await Promise.all([
        UserData.getFavourites(parent.username),
        UserData.getWatched(parent.username),
        UserData.getLikedMovies(parent.username),
        UserData.getWatchlist(parent.username)
      ])
      return {favouritePeople: people.length, watched: watched.length, moviesLiked: liked.length, watchlist: watchlist.length}
    }
  },
  SearchResult: {
    __resolveType: (obj: SearchResult) => isMovieSummary(obj) ? 'Movie' : 'PersonInfo'
  },
  Query: applyAuth({
    recommendedMovies: (_1, args: QueryRecommendedMoviesArgs, {user}) => recommendedMoviesResolver(user.username, args.size || 18) as unknown as Promise<Movie[]>,
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
    trending: (_, args: QueryTrendingArgs) => MovieDb.trending(args.size || 12),
    upcoming: async (_1, _2, {user}) => await upcomingMoviesResolver(user.username) as any,
    user: async (_, args: QueryUserArgs, {user}) => {
      const requestedUser = getUser(args.username)
      const canViewUser = user.username === requestedUser.username || user.isAdmin || requestedUser.public
      if (!canViewUser) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT FOUND',
            http: {status: 404},
          },
        })
      }
      return requestedUser as any
    },
    users: requiresAdmin(async () => getUsers() as any)
  }),
  Mutation: {
    setFavourite: (_, args: MutationSetFavouriteArgs, {user}) => {
      UserData.setFavourite(user.username, args.id, args.favourited)
      return MovieDb.personInfo(args.id) as any
    },
    setWatched: (_, args: MutationSetWatchedArgs, {user}) => {
      UserData.setWatched(user.username, args.id, args.watched)
      return MovieDb.movieInfo(args.id) as any
    },
    setInWatchlist: (_, args: MutationSetInWatchlistArgs, {user}) => {
      UserData.setInWatchlist(user.username, args.id, args.inWatchlist)
      return MovieDb.movieInfo(args.id) as any
    },
    setSentiment: (_, args: MutationSetSentimentArgs, {user}) => {
      UserData.setSentiment(user.username, args.id, args.sentiment)
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

function requiresAdmin<TResult, TParent = {}, TContext = {}, TArgs = {}>(resolver: ResolverFn<TResult, TParent, TContext, TArgs>): ResolverFn<TResult, TParent, TContext, TArgs> {
  return (parent: any, args: any, context: any, info: any) => {
    if (!context.user?.isAdmin) {
      throw new GraphQLError('You must be admin', {
        extensions: {
          code: 'FORBIDDEN',
          http: {status: 403},
        },
      })
    }
    return resolver(parent, args, context, info)
  }
}

export default index
