const {createServer} = require('esbuild-server')

const PORT = process.env.PORT || 4000

const server = createServer(
  {
    entryPoints: ['src/index.tsx', 'src/serviceWorker.ts'],
    outdir: 'public/static',
    bundle: true,
    sourcemap: true
  },
  {
    static: 'public',
    port: PORT,
    historyApiFallback: true,
    proxy: {
      '/loginWithPassword': 'http://localhost:3000',
      '/graphql': 'http://localhost:3000'
    }
  }
)

server.start()
  .then(() => console.log(`🚀 Frontend ready at http://localhost:${PORT}`))
  .catch(console.error)
