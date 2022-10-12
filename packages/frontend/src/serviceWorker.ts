import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, Route } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

precacheAndRoute([{url: '/offline.png', revision: null}])

const staticAssetRoute = new Route(
  ({request}) => ['document', 'font', 'script', 'style'].includes(request.destination),
  new NetworkFirst({cacheName: 'static-assets'})
)
const imageAssetRoute = new Route(
  ({request}) => request.destination === 'image',
  new CacheFirst({cacheName: 'image-assets'})
)


registerRoute(staticAssetRoute)
registerRoute(imageAssetRoute)
