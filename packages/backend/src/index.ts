import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express'
import * as fs from 'fs'
import resolvers from './resolvers'
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault, } from 'apollo-server-core'
import express, { Request, Response } from 'express'
import cors from 'cors'
import * as http from 'http'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { users } from './services/users'
import { User } from '../types'
import { setupDataDir } from './services/dataStorage'
import { ExpressContext } from 'apollo-server-express/src/ApolloServer'

dotenv.config()
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: ['http://localhost:4000', 'https://d11msqkk13y61p.cloudfront.net'],
  credentials: true,
  allowedHeaders: ['Content-Type'],
}

async function main() {
  setupDataDir()

  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser('secret'))
  app.get('/', (req, res) => res.send('OK'))
  app.use(express.static('../../client/build'))
  app.post('/login', login)
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
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      ApolloServerPluginLandingPageLocalDefault({embed: true}),
    ],
  })

  await server.start()
  server.applyMiddleware({app, cors: corsOptions})
  await new Promise<void>(resolve => httpServer.listen({port: PORT}, resolve))
  console.log(`🚀 Backend ready at http://localhost:${PORT}`)
}

function login(req: Request, res: Response) {
  const user = users.find(u => u.username === req.body.username && u.password === req.body.password)
  if (user) {
    res.cookie('user', JSON.stringify(user), {sameSite: 'none', signed: true, secure: true})
    const {password, ...userWithoutPassword} = user
    res.json(userWithoutPassword)
  } else {
    res.sendStatus(401)
  }
}

function authContext({req}: ExpressContext) {
  const user = JSON.parse(req.signedCookies.user || null) as User || JSON.parse(req.cookies.user || null) as User
  return {user}
}

main().catch(console.error)
