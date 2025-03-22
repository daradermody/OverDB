import {TRPCError} from '@trpc/server'
import {z} from 'zod'
import type {MovieCredit} from '../../types'
import {ListType, type PersonCredit, Sentiment} from '../apiTypes.ts'
import recommendedMoviesResolver from '../resolvers/recommendedMovies.ts'
import MovieDb from '../services/MovieDb.ts'
import {UserData} from '../services/UserData.ts'
import {sortMoviesByReleaseDateAsc} from '../utils/sorting.ts'
import {loginRoute} from './auth.ts'
import {publicProcedure, router, userProcedure} from './router.ts'

export const appRouter = router({
  login: loginRoute,
  search: publicProcedure
    .input(z.string())
    .query(({input}) => MovieDb.search(input)),
  trendingMovies: publicProcedure
    .input(z.object({size: z.number().min(1).default(10)}).default({}))
    .query(({input}) => MovieDb.trending(input.size)),
  recommendedMovies: userProcedure
    .input(z.object({size: z.number().min(1).default(10)}).default({}))
    .query(({input, ctx}) => recommendedMoviesResolver(ctx.user.username, input.size || 18)),

  // Person stuff
  person: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input}) => MovieDb.personInfo(input.id)),
  movieCreditsForPerson: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input}) => MovieDb.personMovieCredits(input.id)),
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
  personCreditsForMovie: publicProcedure
    .input(z.object({id: z.string(), type: z.enum(['Crew', 'Cast']).optional()}))
    .query(async ({input}) => {
      if (input.type) {
        return input.type === 'Crew' ? MovieDb.movieCrew(input.id) : MovieDb.movieCast(input.id)
      }
      return [...await MovieDb.movieCrew(input.id), ...await MovieDb.movieCast(input.id)]
    }),
  crew: publicProcedure
    .input(z.object({id: z.string()}))
    .query(({input}) => MovieDb.movieCrew(input.id)),
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
  lists: userProcedure
    .input(z.object({username: z.string(), type: z.nativeEnum(ListType).optional()}))
    .query(({input}) => UserData.getLists(input.username)
      .filter(list => !input.type || list.type === input.type)
      .map(list => ({...list, size: list.ids.length}))
    ),
  inList: userProcedure
    .input(z.object({listId: z.string(), itemId: z.string()}))
    .query(({input, ctx}) => UserData.getList(ctx.user.username, input.listId).ids.includes(input.itemId)),
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
    .mutation(async ({input, ctx}) => UserData.removeFromList(ctx.user.username, input.listId, input.itemId))
})

export type AppRouter = typeof appRouter;
