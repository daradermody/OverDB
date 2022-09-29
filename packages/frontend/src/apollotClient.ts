import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

declare const SERVER_URL: string

export default new ApolloClient({
  link: createHttpLink({
    uri: `${SERVER_URL}/graphql`,
    credentials: 'include'
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          watched: {
            keyArgs: false,
            read(existing, {args}) {
              const offset = args.offset || 0
              const limit = args.limit || undefined
              return existing && existing.results.slice(offset, offset + limit)
            },
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
})
