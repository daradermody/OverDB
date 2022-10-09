import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { LocalForageWrapper, persistCache } from 'apollo3-cache-persist'
import * as localForage from 'localforage'
import { useEffect, useState } from 'react'

declare const SERVER_URL: string

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        watched: {
          keyArgs: false,
          merge(existing, incoming, {args: {offset = 0}}) {
            const merged = existing?.results?.slice(0) || []
            for (let i = 0; i < incoming.results.length; ++i) {
              merged[offset + i] = incoming.results[i]
            }
            return {
              offset: offset,
              limit: merged.length,
              endReached: incoming.endReached,
              results: merged,
            }
          },
        }
      }
    }
  }
})

export default function useApolloClient() {
  const [client, setClient] = useState<ApolloClient<any>>()

  useEffect(() => {
    createClient().then(setClient)
  }, [])

  useEffect(() => {
    window.addEventListener('online', () => client.resetStore())
  })

  return client
}

async function createClient() {
  await persistCache({
    cache,
    storage: new LocalForageWrapper(localForage),
  })
  return new ApolloClient({
    link: createHttpLink({uri: `${SERVER_URL}/graphql`, credentials: 'include'}),
    cache
  })
}
