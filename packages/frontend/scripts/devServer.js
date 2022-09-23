const { createServer } = require('esbuild-server')

const PORT = 4000

const server = createServer(
  {
    entryPoints: ['src/index.tsx'],
    outdir: 'public/static',
    bundle: true,
    sourcemap: true,
    define: {
      SERVER_URL: '"http://localhost:3000"',
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
