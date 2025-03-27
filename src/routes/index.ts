import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { ListType, Sentiment } from '../apiTypes.ts'
import recommendedMoviesResolver from '../resolvers/recommendedMovies.ts'
import upcomingMoviesResolver from '../resolvers/upcomingMoviesResolver.ts'
import MovieDb from '../services/MovieDb.ts'
import RottenTomatoes from '../services/RottenTomatoes.ts'
import { UserData } from '../services/UserData.ts'
import { getUser, getUsers } from '../services/users.ts'
import { loginRoute } from './auth.ts'
import { adminProcedure, canAccessUser, publicProcedure, router, userProcedure } from './router.ts'

export const appRouter = router({
  login: loginRoute,
  search: publicProcedure
    .input(z.string())
    .query(({input}) => MovieDb.search(input)),
  trendingMovies: publicProcedure
    .input(z.object({size: z.number().min(1).default(10)}).default({}))
    .query(({input}) => MovieDb.trending(input.size)),
  allStreamingProviders: publicProcedure
    .input(z.object({region: z.string()}))
    .query(({input}) => MovieDb.allStreamingProviders(input.region)),

  // User stuff
  user: publicProcedure
    .input(z.object({username: z.string()}))
    .use(canAccessUser)
    .query(({input}) => getUser(input.username)),
  users: adminProcedure
    .query(() => getUsers().map(user => ({
      ...user,
      stats: {
        favouritePeople: UserData.getFavourites(user.username).length,
        watched: UserData.getWatched(user.username).length,
        moviesLiked: UserData.getLikedMovies(user.username).length,
        watchlist: UserData.getWatchlist(user.username).length
      }
    }))),
  userStats: publicProcedure
    .input(z.object({username: z.string()}))
    .use(canAccessUser)
    .query(({input}) => ({
      favouritePeople: UserData.getFavourites(input.username).length,
      watched: UserData.getWatched(input.username).length,
      moviesLiked: UserData.getLikedMovies(input.username).length,
      watchlist: UserData.getWatchlist(input.username).length
    })),
  getWatched: publicProcedure
    .input(z.object({username: z.string(), limit: z.number().min(1).max(40).default(20), cursor: z.number().default(0)}))
    .use(canAccessUser)
    .query(async ({input}) => {
      const watchedIds = UserData.getWatched(input.username).toReversed().slice(input.cursor, input.cursor + input.limit)
      return {
        items: await Promise.all(watchedIds.map(MovieDb.movieInfo)),
        nextCursor: UserData.getWatched(input.username)[input.cursor + input.limit] ? input.cursor + input.limit : undefined
      }
    }),
  favouritePeople: publicProcedure
    .input(z.object({username: z.string(), limit: z.number().min(1).max(40).default(20), cursor: z.number().default(0)}))
    .use(canAccessUser)
    .query(async ({input}) => {
      const favouritedIds = UserData.getFavourites(input.username).toReversed().slice(input.cursor, input.cursor + input.limit)
      return {
        items: await Promise.all(favouritedIds.map(MovieDb.personInfo)),
        nextCursor: UserData.getFavourites(input.username)[input.cursor + input.limit] ? input.cursor + input.limit : undefined
      }
    }),
  likedMovies: publicProcedure
    .input(z.object({username: z.string(), limit: z.number().min(1).max(40).default(20), cursor: z.number().default(0)}))
    .use(canAccessUser)
    .query(async ({input}) => {
      const likedIds = UserData.getLikedMovies(input.username).toReversed().slice(input.cursor, input.cursor + input.limit)
      return {
        items: await Promise.all(likedIds.map(MovieDb.movieInfo)),
        nextCursor: UserData.getLikedMovies(input.username)[input.cursor + input.limit] ? input.cursor + input.limit : undefined
      }
    }),
  userSettings: userProcedure
    .query(({ctx}) => UserData.getSettings(ctx.user.username)),
  updateUserSettings: userProcedure
    .input(z.object({streaming: z.object({providers: z.array(z.string()).optional(), region: z.string().optional()}).optional()}))
    .mutation(({input, ctx}) => UserData.updateSettings(ctx.user.username, input)),

  // List stuff
  lists: publicProcedure
    .input(z.object({username: z.string(), type: z.nativeEnum(ListType).optional()}))
    .use(canAccessUser)
    .query(({input}) => UserData.getLists(input.username)
      .filter(list => !input.type || list.type === input.type)
      .map(list => ({...list, size: list.ids.length}))
    ),
  inList: userProcedure
    .input(z.object({listId: z.string(), itemId: z.string()}))
    .query(({input, ctx}) => UserData.getList(ctx.user.username, input.listId).ids.includes(input.itemId)),
  createList: userProcedure
    .input(z.object({name: z.string(), type: z.nativeEnum(ListType)}))
    .mutation(({input, ctx}) => UserData.createList(ctx.user.username, input)),
  deleteList: userProcedure
    .input(z.object({ids: z.array(z.string())}))
    .mutation(({input, ctx}) => UserData.deleteLists(ctx.user.username, input.ids)),
  editList: userProcedure
    .input(z.object({id: z.string(), name: z.string()}))
    .mutation(({input, ctx}) => UserData.updateList(ctx.user.username, input.id, {name: input.name})),
  addToList: userProcedure
    .input(z.object({listId: z.string(), itemId: z.string()}))
    .mutation(async ({input, ctx}) => {
      try {
        if (UserData.getList(ctx.user.username, input.listId).type === ListType.Movie) {
          await MovieDb.movieInfo(input.itemId)
        } else {
          await MovieDb.personInfo(input.itemId)
        }
      } catch (e) {
        throw new TRPCError({code: 'BAD_REQUEST', message: `ID being added to the list is not valid: ${input.itemId}`})
      }
      UserData.addToList(ctx.user.username, input.listId, input.itemId)
    }),
  removeFromList: userProcedure
    .input(z.object({listId: z.string(), itemId: z.string()}))
    .mutation(async ({input, ctx}) => UserData.removeFromList(ctx.user.username, input.listId, input.itemId)),

  // Person stuff
  person: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input}) => MovieDb.personInfo(input.id)),
  movieCreditsForPerson: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input}) => MovieDb.getPersonCredits(input.id)),
  isFavourite: userProcedure
    .input(z.object({id: z.string()}))
    .query(({input, ctx}) => UserData.isFavourited(ctx.user.username, input.id)),
  setFavourite: userProcedure
    .input(z.object({id: z.string(), isFavourited: z.boolean()}))
    .mutation(({input, ctx}) => UserData.setFavourite(ctx.user.username, input.id, input.isFavourited)),

  // Movie stuff
  movie: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input}) => MovieDb.movieInfo(input.id)),
  movieCredits: publicProcedure
    .input(z.object({id: z.string(), type: z.enum(['Crew', 'Cast']).optional()}))
    .query(({input}) => MovieDb.getMovieCredits(input.id, {type: input.type})),
  tomatometer: publicProcedure
    .input(z.object({imdbId: z.string()}))
    .query(({input}) => RottenTomatoes.getScore(input.imdbId)),
  streamingProvidersShowingMovie: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input, ctx}) => MovieDb.streamingProviders(input.id, ctx.user ? UserData.getSettings(ctx.user.username).streaming?.region || 'IE' : 'IE')),
  recommendedMovies: userProcedure
    .input(z.object({size: z.number().min(1).default(10)}).default({}))
    .query(({input, ctx}) => recommendedMoviesResolver(ctx.user.username, input.size || 18)),
  isWatched: userProcedure
    .input(z.object({id: z.string()}))
    .query(({input, ctx}) => UserData.isWatched(ctx.user.username, input.id)),
  setWatched: userProcedure
    .input(z.object({movieId: z.string(), isWatched: z.boolean()}))
    .mutation(({input, ctx}) => UserData.setWatched(ctx.user.username, input.movieId, input.isWatched)),
  sentiment: userProcedure
    .input(z.object({id: z.string()}))
    .query(({input, ctx}) => UserData.getSentiment(ctx.user.username, input.id)),
  setSentiment: userProcedure
    .input(z.object({movieId: z.string(), sentiment: z.nativeEnum(Sentiment)}))
    .mutation(({input, ctx}) => UserData.setSentiment(ctx.user.username, input.movieId, input.sentiment)),
  upcomingMovies: userProcedure
    .query(({ctx}) => upcomingMoviesResolver(ctx.user.username))
})

export type AppRouter = typeof appRouter;
