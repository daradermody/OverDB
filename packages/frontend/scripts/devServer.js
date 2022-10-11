const { createServer } = require('esbuild-server')

const PORT = process.env.PORT || 4000
const SERVER_PORT = process.env.SERVER_PORT || 3000

const server = createServer(
  {
    entryPoints: ['src/index.tsx', 'src/serviceWorker.ts'],
    outdir: 'public/static',
    bundle: true,
    sourcemap: true,
    define: {
      SERVER_URL: `"http://localhost:${SERVER_PORT}"`,
    },
  },
  {
    static: 'public',
    port: PORT,
    historyApiFallback: true,
  }
)

server.start()
  .then(() => console.log(`🚀 Frontend ready at http://localhost:${PORT}`))
  .catch(console.error)
