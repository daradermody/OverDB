import {initTRPC, TRPCError} from '@trpc/server'
import type {User} from '../services/users.ts'

const t = initTRPC.context<{ user?: User, resHeaders: Headers }>().create()
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
