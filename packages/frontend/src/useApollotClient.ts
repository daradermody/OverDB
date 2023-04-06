import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist'
import * as localForage from 'localforage'
import { useEffect, useState } from 'react'

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
  const cachePersistor = new CachePersistor({cache, storage: new LocalForageWrapper(localForage)})
  if (!navigator.onLine) {
    await cachePersistor.restore()
  }
  return new ApolloClient({link: from([errorLink, httpLink]), cache})
}

const errorLink = onError(error => {
  if (error.graphQLErrors?.[0].extensions.code === 'UNAUTHENTICATED') {
    window.location.href = `${window.location.origin}/login?andWeWillGetYouTo=${window.location.pathname}`
  }
})

const httpLink = createHttpLink({uri: `/graphql`, credentials: 'include'})
