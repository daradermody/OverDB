import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault, } from 'apollo-server-core'
import { ApolloServer, gql } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import * as fs from 'fs'
import * as http from 'http'
import { join } from 'path'
import resolvers from './resolvers'
import { setupDataDir } from './services/dataStorage'
import { getUser, isLoginValid, User } from './services/users'
import getToken from './utils/getToken'

dotenv.config()
const PORT = process.env.PORT || 3000
const SIX_MONTHS_IN_MILLIS = 6 * 30 * 24 * 60 * 60 * 1000

async function main() {
  setupDataDir()

  const app = express()
  app.use(cors({allowedHeaders: ['Content-Type']}))
  app.use(express.json())
  app.use(cookieParser(getToken('COOKIE_SECRET')))
  app.use(express.static(join(__dirname, 'static')))
  app.post('/loginWithPassword', login)
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs: gql(fs.readFileSync(__dirname + '/schema.graphql', 'utf-8')),
    resolvers,
    formatError: (error) => {
      console.log(JSON.stringify(error, null, 2))
      return error
    },
    csrfPrevention: true,
    cache: 'bounded',
    context: authContext,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      ApolloServerPluginLandingPageLocalDefault({embed: true}),
    ],
  })

  await server.start()
  server.applyMiddleware({app, cors: {allowedHeaders: ['Content-Type']}})
  app.get('*', (req, res) => res.sendFile(join(__dirname, 'static/index.html')))
  await new Promise<void>(resolve => httpServer.listen({port: PORT}, resolve))
  console.log(`🚀 Backend ready at http://localhost:${PORT}`)
}

async function login(req: Request, res: Response) {
  if (await isLoginValid(req.body.username, req.body.password)) {
    const user = getUser(req.body.username)
    const cookie = JSON.stringify(user)
    res.cookie('user', cookie, {maxAge: SIX_MONTHS_IN_MILLIS, signed: true, secure: process.env.NODE_ENV === 'production'})
    res.json(user)
  } else {
    res.sendStatus(401)
  }
}

function authContext({req}: ExpressContext) {
  const user = JSON.parse(req.signedCookies.user || null) as User
  return {user}
}

main().catch(console.error)
