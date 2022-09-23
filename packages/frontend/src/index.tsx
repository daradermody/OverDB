import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import App from './App'
import theme from './theme'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

document.body.style.fontFamily = 'Roboto'
document.body.style.margin = '0'
document.body.style.backgroundColor = theme.palette.background.default

declare const SERVER_URL: string

const client = new ApolloClient({
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


const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </ApolloProvider>
    </ThemeProvider>
  </StyledEngineProvider>
)
