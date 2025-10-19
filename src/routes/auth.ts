import {TRPCError} from '@trpc/server'
import cookie from 'cookie'
import cookieSignature from 'cookie-signature'
import {z} from 'zod'
import type { User } from '../apiTypes.ts'
import {getUser, isLoginValid} from '../services/users.ts'
import getToken from '../utils/getToken.ts'
import {publicProcedure} from './router.ts'

const SIX_MONTHS_IN_SECONDS = 6 * 30 * 24 * 60 * 60

export const loginRoute = publicProcedure
  .input(z.object({username: z.string(), password: z.string()}))
  .mutation(async ({input, ctx}) => {
    if (!await isLoginValid(input.username, input.password)) {
      throw new TRPCError({code: 'UNAUTHORIZED', message: 'Credentials invalid'})
    }
    const user = getUser(input.username)
    ctx.resHeaders.set('Set-Cookie', await getCookie(user))
    return user
  })


async function getCookie(user: User): Promise<string> {
  const signedCookie = cookieSignature.sign(JSON.stringify(user), getToken('COOKIE_SECRET'))
  return `user=${signedCookie}; Max-Age=${SIX_MONTHS_IN_SECONDS}; Path=/; Secure; SameSite=Strict`
}

export function getUserFromRequest(req: Request): User | undefined {
  const cookieHeader = req.headers.get('Cookie')
  if (!cookieHeader) {
    return undefined
  }
  const cookies = cookie.parse(cookieHeader)
  const userCookie = cookies.user
  if (!userCookie) {
    return undefined
  }
  const unsignedUserCookie = cookieSignature.unsign(userCookie, getToken('COOKIE_SECRET'))
  if (!unsignedUserCookie) {
    return undefined
  }
  return JSON.parse(unsignedUserCookie) as User
}
