import {ApolloServer} from '@apollo/server'
import { expressMiddleware, type ExpressContextFunctionArgument } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {startServerAndCreateNextHandler} from '@as-integrations/next'
import * as dotenv from 'dotenv'
// import express, { type Request, type RequestHandler, type Response } from 'express'
import * as fs from 'fs'
import * as http from 'http'
import { join } from 'path'
import resolvers from './resolvers'
import { setupDataDir } from './services/dataStorage'
import {getUser, isLoginValid, type User} from './services/users'
import getToken from './utils/getToken'
import indexHtml from './public/public/index.html'
import cookie from 'cookie'
import cookieSignature from 'cookie-signature'

const SIX_MONTHS_IN_SECONDS = 6 * 30 * 24 * 60 * 60

const gqlServer = new ApolloServer({
  typeDefs: await Bun.file(__dirname + '/schema.graphql').text(),
  resolvers,
  formatError: (error) => {
    console.log(JSON.stringify(error, null, 2))
    return error
  },
  csrfPrevention: false,
  cache: 'bounded',
  introspection: true,
})

const apolloHandler = startServerAndCreateNextHandler(gqlServer, { context: context })

setupDataDir()
Bun.serve({
  routes: {
    '/*': indexHtml,
    '/icon.png': new Response(await Bun.file('./src/public/public/icon.png').bytes(), { headers: { 'Content-Type': 'image/png' } }),
    '/graphql': {
      GET: async req => await apolloHandler(req),
      POST: async req => await apolloHandler(req)
    },
    '/loginWithPassword': {
      POST: async req => await login(req)
    }
  },
  development: true,
  port: 3000
});
console.log('🚀 Serving http://localhost:3000')


async function login(req: Request): Promise<Response> {
  const { username, password } = await req.json() as { username: string; password: string }
  if (await isLoginValid(username, password)) {
    const user = getUser(username)
    const signedCookie =  cookieSignature.sign(JSON.stringify(user), getToken('COOKIE_SECRET'))
    const httpOnly = Bun.env.NODE_ENV === 'production' ? 'httpOnly' : ''
    return Response.json(user, {
      headers: {
        'Set-Cookie': `user=${signedCookie}; Max-Age=${SIX_MONTHS_IN_SECONDS}; Path=/; ${httpOnly}; Secure; SameSite=Strict`,
      }
    })
  } else {
    return new Response(null, { status: 401 })
  }
}

async function context(req: Request) {
  const cookieHeader = req.headers.get('Cookie')
  if (!cookieHeader) {
    return {}
  }
  const cookies = cookie.parse(cookieHeader);
  const userCookie = cookies.user
  if (!userCookie) {
    return {}
  }
  const unsignedUserCookie = cookieSignature.unsign(userCookie, getToken('COOKIE_SECRET'))
  if (!unsignedUserCookie) {
    return {}
  }
  return { user: JSON.parse(unsignedUserCookie) as User }
}
