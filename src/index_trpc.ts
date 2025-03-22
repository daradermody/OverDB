import {fetchRequestHandler, type FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch'
import indexHtml from './public/public/index.html'
import {getUserFromRequest} from './routes/auth.ts'
import {appRouter} from './routes'
import type {User} from './services/users.ts'

const apiHandler = (req: Request) => fetchRequestHandler({
  endpoint: '/trpc',
  req,
  router: appRouter,
  createContext,
})

Bun.serve({
  development: Bun.env.NODE_ENV === 'development',
  port: 3000,
  routes: {
    '/*': indexHtml,
    '/icon.png': new Response(await Bun.file('./src/public/public/icon.png').bytes(), {headers: {'Content-Type': 'image/png'}}),
    '/api/*': {
      GET: apiHandler,
      POST: apiHandler
    }
  }
})
console.log('🚀 Serving http://localhost:3000')

function createContext(options: FetchCreateContextFnOptions): { user?: User; resHeaders: Headers } {
  return {
    user: getUserFromRequest(options.req),
    resHeaders: options.resHeaders
  }
}
