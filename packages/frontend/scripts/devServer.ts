import { watch } from "fs";
const PORT = process.env.PORT || 4000

async function main() {
  serve()
  await build()
  watch('src', { recursive: true }, debounce(build, 20));
}

function serve() {
  Bun.serve({
    port: PORT,
    async fetch(req) {
      const pathname = getPathname(req.url)

      if (['/loginWithPassword', '/graphql'].includes(pathname)) {
        return await fetch(`http://localhost:3000${pathname}`, {method: req.method, body: await req.text(), headers: req.headers})
      }

      if (await Bun.file(`./build/${pathname}`).exists()) {
        return new Response(Bun.file(`./build/${pathname}`))
      } else if (await Bun.file(`./public/${pathname}`).exists()) {
        return new Response(Bun.file(`./public/${pathname}`))
      } else {
        return new Response(Bun.file(`./public/index.html`))
      }
    }
  })
  console.log(`🚀 Frontend ready at http://localhost:${PORT}`)
}

function getPathname(url: string): string {
  const pathname = new URL(url).pathname
  return pathname === '/' ? '/index.html' : pathname
}

async function build(trigger?: string) {
  const start = new Date()
  await Bun.build({
    entrypoints: ['./src/index.tsx', 'src/serviceWorker.ts'],
    root: './src',
    outdir: './build',
    sourcemap: 'external',
    splitting: true,
    define: {
      NODE_ENV: "'development'"
    }
  })
  const end = new Date()
  const durationMs = end.valueOf() - start.valueOf()
  const action = trigger ? 'Rebuilt' : 'Built'
  console.log(`[${end.toLocaleTimeString(undefined, {hour12: false})}] ${action} in ${durationMs}ms`)
}

function debounce(fn, wait) {
  let isWaitingToStart = false
  return async function debouncedFn(...args) {
    if (!isWaitingToStart) {
      isWaitingToStart = true
      setTimeout(async () => {
        isWaitingToStart = false
        await fn(...args)
      }, wait)
    }
  }

}

main().catch(console.error)
