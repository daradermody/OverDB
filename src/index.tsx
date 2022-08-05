import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles';
import 'core-js/stable';

import React from 'react';
import {render} from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './App';
import theme from "./theme";

const root = document.createElement('div');
document.body.appendChild(root);
document.body.style.fontFamily = 'Roboto';
document.body.style.margin = '0';
document.body.style.backgroundColor = theme.palette.background.default

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          watched: {
            keyArgs: false,
            read(existing, { args }) {
              const offset = args.offset || 0
              const limit = args.limit || undefined
              return existing && existing.results.slice(offset, offset + limit);
            },
            merge(existing, incoming, { args: { offset = 0 }}) {
              const merged = existing?.results?.slice(0) || [];
              for (let i = 0; i < incoming.results.length; ++i) {
                merged[offset + i] = incoming.results[i];
              }
              return {
                offset: offset,
                limit: merged.length,
                endReached: incoming.endReached,
                results: merged,
              };
            },
          }
        }
      }
    }
  })
});

render((
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App/>
      </ApolloProvider>
    </ThemeProvider>
  </StyledEngineProvider>
), root);

// TODO: Suggest people
// TODO: Add cast
