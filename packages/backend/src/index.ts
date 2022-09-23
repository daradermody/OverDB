import { ApolloServer, AuthenticationError, gql } from 'apollo-server-express'
import * as fs from 'fs'
import resolvers from './resolvers'
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault, } from 'apollo-server-core'
import * as express from 'express'
import * as cors from 'cors'
import * as http from 'http'
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import { users } from './services/users'
import { User } from '../types'
import { setupDataDir } from './services/dataStorage'

dotenv.config()
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:4000', 'https://d11msqkk13y61p.cloudfront.net', 'https://dzbi8yrdpm1hx.cloudfront.net'],
  credentials: true,
  allowedHeaders: ['Content-Type'],
}

async function main() {
  setupDataDir()

  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(cookieParser())
  app.get('/', (req, res) => res.send('OK'))
  app.use(express.static('../../client/build'))
  app.post('/login', (req, res) => {
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password)
    if (user) {
      res.cookie('user', JSON.stringify(user))
      res.sendStatus(200)
    } else {
      res.sendStatus(401)
    }
  })
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
    context: ({req}) => {
      const user = JSON.parse(req.cookies.user || null) as User
      if (!user) throw new AuthenticationError('You must be logged in')
      return {user}
    },
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

main().catch(console.error)
