import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { registerRoute, Route } from 'workbox-routing'
import { precacheAndRoute } from 'workbox-precaching'
import { IDBPDatabase, openDB } from 'idb'

precacheAndRoute([{url: '/offline.png', revision: null}])

let db: IDBPDatabase
// openDB('overdb', 1, {
//   upgrade(db, oldVersion, newVersion, transaction) {
//     switch (oldVersion) {
//       case 0:
//       case 1:
//         db.createObjectStore('graphql')
//     }
//   }
// })
//   .then(result => db = result)

async function addData(key: string, data: any) {
  const tx = await db.transaction('graphql', 'readwrite')
  const store = tx.objectStore('graphql')
  store.put(data, key)
  await tx.done
}

async function getData(key: string) {
  const tx = await db.transaction('graphql', 'readonly')
  const store = tx.objectStore('graphql')
  return await store.get(key)
}

const staticAssetRoute = new Route(
  ({request}) => ['document', 'font', 'script', 'style'].includes(request.destination),
  new NetworkFirst({cacheName: 'static-assets'})
)
const imageAssetRoute = new Route(
  ({request}) => request.destination === 'image',
  new CacheFirst({cacheName: 'image-assets'})
)

const graphQlRoute = new Route(
  ({request}) => request.url.endsWith('/graphql'),
  async ({request}) => {
    const key = (await request.clone().json()).operationName
    if (navigator.onLine || !(await request.clone().json()).query) {
      const response = await fetch(request)
      const obj = {
        status: response.status,
        headers: Object.fromEntries((response.headers as any).entries()),
        body: await response.clone().json()
      }
      console.log('storing', obj)
      await addData(key, obj)
      return response
    } else {
      const {status, headers, body} = await getData(key)
      console.log({status, headers, body})
      return new Response(body, {headers, status})
    }
  },
  'POST'
)

registerRoute(staticAssetRoute)
// registerRoute(imageAssetRoute)
// registerRoute(graphQlRoute)
