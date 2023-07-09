import { GraphQLError } from 'graphql/error'
import { GraphQLResolveInfo } from 'graphql/type'
import {
  isMovieSummary,
  List,
  ListType,
  Movie,
  MovieCredit,
  MovieOrPerson,
  MutationAddToListArgs,
  MutationCreateListArgs,
  MutationDeleteListsArgs,
  MutationEditListArgs,
  MutationSetFavouriteArgs,
  MutationSetInWatchlistArgs,
  MutationSetSentimentArgs,
  MutationSetWatchedArgs,
  MutationUpdateUserSettingsArgs,
  PaginatedMovies,
  PaginatedPeople,
  PersonInfo,
  PersonWithoutFav, Provider,
  QueryCastForMovieArgs,
  QueryCreditsForPersonArgs,
  QueryCrewForMovieArgs,
  QueryMovieArgs,
  QueryPersonArgs,
  QueryRecommendedMoviesArgs,
  QuerySearchArgs,
  QueryStreamingProvidersArgs,
  QueryTrendingArgs,
  QueryUserArgs,
  ResolverFn,
  Resolvers,
  User as ApiUser
} from '../../types'
import MovieDb from '../services/MovieDb'
import RottenTomatoes from '../services/RottenTomatoes'
import { StoredList, UserData } from '../services/UserData'
import { getUser, getUsers, User } from '../services/users'
import { paginate } from './pagination'
import recommendedMoviesResolver from './recommendedMovies'
import upcomingMoviesResolver from './upcomingMoviesResolver'

const index: Resolvers<{ user?: User }> = {
  Movie: {
    sentiment: (parent, _, {user}) => user ? UserData.getSentiment(user.username, parent.id) : null,
    watched: (parent, _, {user}) => user ? UserData.isWatched(user.username, parent.id) : null,
    inWatchlist: (parent, _, {user}) => user ? UserData.inWatchlist(user.username, parent.id) : null,
    tomatometer: ({imdbId}) => RottenTomatoes.getScore(imdbId),
    providers: ({id}, _, {user}) => MovieDb.streamingProviders(id, user ? UserData.getSettings(user.username).streaming.region || 'IE' : 'IE')
  },
  MovieCredit: {
    sentiment: (parent: MovieCredit, _, {user}) => user ? UserData.getSentiment(user.username, parent.id) : null,
    watched: (parent: MovieCredit, _, {user}) => user ? UserData.isWatched(user.username, parent.id) : null,
    inWatchlist: (parent: MovieCredit, _, {user}) => user ? UserData.inWatchlist(user.username, parent.id) : null,
  },
  PersonInfo: {
    favourited: (parent: PersonWithoutFav, _, {user}) => user ? UserData.isFavourited(user.username, parent.id) : null
  },
  User: {
    favouritePeople: (parent, args) => {
      const ids = UserData.getFavourites(parent.username).slice().reverse()
      return paginate(ids, MovieDb.personInfo, args.offset, args.limit) as Promise<PaginatedPeople>
    },
    watchlist: async (parent, args, {user}) => {
      let ids = UserData.getWatchlist(parent.username).slice().reverse()
      if (!!args.filteredByProviders && user?.username === parent.username) {
        const subscribedProviderIds = UserData.getSettings(user.username).streaming.providers
        const region = UserData.getSettings(user.username).streaming.region || 'IE'
        const idsAndProviders = await Promise.all(ids.map(async id => [id, await MovieDb.streamingProviders(id, region)] as const))
        ids = idsAndProviders
          .filter(([id, providerIds]) => providerIds.some(({id}) => subscribedProviderIds.includes(id)))
          .map(([id]) => id)
      }
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
    },
    lists: async (parent, args) => await Promise.all(
      UserData.getLists(parent.username)
        .sort((a, b) => a.id === 'watchlist' || (b.id !== 'watchlist' && a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1)
        .filter(list => !args.type || list.type === args.type)
        .map(convertList)
    ),
    list: async (parent, args, {user}) => {
      const requestedUser = getUser(parent.username)
      verifyUserAccessible(requestedUser, user)
      return convertList(UserData.getList(parent.username, args.id))
    },
  },
  MovieOrPerson: {
    __resolveType: (obj: MovieOrPerson) => {
      return isMovieSummary(obj) ? 'Movie' : 'PersonInfo'
    }
  },
  Query: {
    recommendedMovies: requiresLogin((_1, args: QueryRecommendedMoviesArgs, {user}) => recommendedMoviesResolver(user.username, args.size || 18) as unknown as Promise<Movie[]>),
    movie: async (_, args: QueryMovieArgs) => await MovieDb.movieInfo(args.id) as Movie,
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
    search: async (_, args: QuerySearchArgs) => await MovieDb.search(args.query) as (PersonWithoutFav | Movie)[],
    person: (_, args: QueryPersonArgs) => MovieDb.personInfo(args.id),
    trending: (_, args: QueryTrendingArgs) => MovieDb.trending(args.size || 12),
    upcoming: requiresLogin(async (_1, _2, {user}) => await upcomingMoviesResolver(user.username) as Movie[]),
    user: async (_, args: QueryUserArgs, {user}) => {
      const requestedUser = getUser(args.username)
      verifyUserAccessible(requestedUser, user)
      return requestedUser as ApiUser
    },
    users: requiresAdmin(async () => getUsers() as ApiUser[]),
    streamingProviders: (_, args: QueryStreamingProvidersArgs) => MovieDb.allStreamingProviders(args.region),
    settings: requiresLogin(async (_1, _2, {user}) => UserData.getSettings(user.username))
  },
  Mutation: {
    setFavourite: requiresLogin((_, args: MutationSetFavouriteArgs, {user}) => {
      UserData.setFavourite(user.username, args.id, args.favourited)
      return MovieDb.personInfo(args.id)
    }),
    setWatched: requiresLogin(async (_, args: MutationSetWatchedArgs, {user}) => {
      UserData.setWatched(user.username, args.id, args.watched)
      return await MovieDb.movieInfo(args.id) as Movie
    }),
    setInWatchlist: requiresLogin(async (_, args: MutationSetInWatchlistArgs, {user}) => {
      UserData.setInWatchlist(user.username, args.id, args.inWatchlist)
      return await MovieDb.movieInfo(args.id) as Movie
    }),
    setSentiment: requiresLogin(async (_, args: MutationSetSentimentArgs, {user}) => {
      UserData.setSentiment(user.username, args.id, args.sentiment)
      return await MovieDb.movieInfo(args.id) as Movie
    }),
    createList: requiresLogin(async (_, args: MutationCreateListArgs, {user}) => {
      return convertList(UserData.createList(user.username, args))
    }),
    deleteLists: requiresLogin((_, args: MutationDeleteListsArgs, {user}) => {
      const existingIds = UserData.getLists(user.username).map(list => list.id)
      const nonExistentIds = args.ids.filter(id => !existingIds.includes(id))
      if (nonExistentIds.length) {
        throw new GraphQLError(`These IDs do not exist: ${nonExistentIds.join(', ')}`, {
          extensions: {
            code: 'BAD_REQUEST',
            http: {status: 400},
          },
        })
      }

      if (args.ids.includes('watchlist')) {
        throw new GraphQLError('You can not delete your watchlist', {
          extensions: {
            code: 'BAD_REQUEST',
            http: {status: 400},
          },
        })
      }
      UserData.deleteLists(user.username, args.ids)
      return true
    }),
    editList: requiresLogin(async (_, args: MutationEditListArgs, {user}) => {
      return await convertList(UserData.updateList(user.username, args.id, {name: args.name}))
    }),
    addToList: requiresLogin(async (_, args: MutationAddToListArgs, {user}) => {
      try {
        if (UserData.getList(user.username, args.listId).type === ListType.Movie) {
          await MovieDb.movieInfo(args.itemId)
        } else {
          await MovieDb.personInfo(args.itemId)
        }
      } catch (e) {
        throw new GraphQLError(`ID being added to the list is not valid: ${args.itemId}`, {
          extensions: {
            code: 'BAD_REQUEST',
            http: {status: 400},
          },
        })
      }
      return convertList(UserData.addToList(user.username, args.listId, args.itemId))
    }),
    removeFromList: requiresLogin(async (_, args: MutationAddToListArgs, {user}) => {
      return convertList(UserData.removeFromList(user.username, args.listId, args.itemId))
    }),
    updateUserSettings: requiresLogin(async (_, args: MutationUpdateUserSettingsArgs, {user}) => {
      return UserData.updateSettings(user.username, args.settings)
    })
  }
}

async function convertList(list: StoredList): Promise<List> {
  return {
    id: list.id,
    type: list.type,
    name: list.name,
    items: await Promise.all(list.ids.map(id => list.type === 'MOVIE' ? MovieDb.movieInfo(id) as Promise<Movie> : MovieDb.personInfo(id) as Promise<PersonInfo>)),
  }
}

function requiresLogin<TResult, TParent, TContext extends { user?: User }, TArgs>(resolver: ResolverFn<TResult, TParent, TContext & { user: User }, TArgs>): ResolverFn<TResult, TParent, TContext, TArgs> {
  return (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo): TResult | Promise<TResult> => {
    if (!context.user) {
      throw new GraphQLError('You must be logged in', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: {status: 401},
        },
      })
    }
    return resolver(parent, args, context as TContext & {user: User}, info)
  }
}

function requiresAdmin<TResult, TParent = {}, TContext extends {user?: User} = {}, TArgs = {}>(resolver: ResolverFn<TResult, TParent, TContext, TArgs>): ResolverFn<TResult, TParent, TContext, TArgs> {
  return (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => {
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

function verifyUserAccessible(requestedUser: User, currentUser?: User) {
  const canViewUser = currentUser?.username === requestedUser.username || currentUser?.isAdmin || requestedUser.public
  if (!canViewUser) {
    throw new GraphQLError('User not found', {
      extensions: {
        code: 'NOT FOUND',
        http: {status: 404},
      },
    })
  }
}

export default index
