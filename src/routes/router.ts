import {initTRPC, TRPCError} from '@trpc/server'
import type { MiddlewareFunction } from '@trpc/server/unstable-core-do-not-import'
import { getUser, type User } from '../services/users.ts'

type Context = { user?: User, resHeaders: Headers }
const t = initTRPC.context<Context>().create()
export const router = t.router

export const publicProcedure = t.procedure

export const userProcedure = publicProcedure.use(({ctx, next}) => {
  if (!ctx.user) {
    throw new TRPCError({code: 'UNAUTHORIZED'})
  }
  return next({ctx: {user: ctx.user}})
})

export const adminProcedure = userProcedure.use(({ctx, next}) => {
  if (!ctx.user.isAdmin) {
    throw new TRPCError({code: 'FORBIDDEN'})
  }
  return next()
})

export const canAccessUser: MiddlewareFunction<Context, object, null, any, {username: string}> = ({input, ctx, next}) => {
  const requestedUser = getUser(input.username)
  const canViewUser = ctx.user?.username === requestedUser.username || ctx.user?.isAdmin || requestedUser.public
  if (!canViewUser) {
    throw new TRPCError({code: 'NOT_FOUND', message: 'User not found'})
  }
  return next()
}
