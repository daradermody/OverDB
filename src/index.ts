import {fetchRequestHandler, type FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch'
import type { User } from './apiTypes.ts'
import indexHtml from './frontend/public/index.html'
import {getUserFromRequest} from './routes/auth.ts'
import {appRouter} from './routes'

const apiHandler = (req: Request) => fetchRequestHandler({
  endpoint: '/trpc',
  req,
  router: appRouter,
  createContext,
})

Bun.serve({
  development: Bun.env.NODE_ENV !== 'production',
  port: Bun.env.PORT || 3000,
  routes: {
    '/*': indexHtml,
    '/privacy.html': new Response(await Bun.file(`${import.meta.dir}/frontend/public/privacy.html`).bytes(), {headers: {'Content-Type': 'text/html'}}),
    '/.well-known/*': async req => {
      const {pathname} = new URL(req.url)
      return new Response(await Bun.file(`${import.meta.dir}/frontend/public${pathname}`).bytes(), {headers: {'Content-Type': 'text/plain'}})
    },
    '/robots.txt': new Response(await Bun.file(`${import.meta.dir}/frontend/public/robots.txt`).bytes(), {headers: {'Content-Type': 'text/plain'}}),
    '/icon.png': new Response(await Bun.file(`${import.meta.dir}/frontend/public/icon.png`).bytes(), {headers: {'Content-Type': 'image/png'}}),
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
