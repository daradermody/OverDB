import { ApolloProvider } from '@apollo/client'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import theme from './theme'
import useApolloClient from './useApollotClient'

document.body.style.fontFamily = 'Roboto'
document.body.style.margin = '0'
document.body.style.backgroundColor = theme.palette.background.default

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Root/>)

function Root() {
  const apolloClient = useApolloClient()
  if (!apolloClient) {
    return null
  }
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <SnackbarProvider>
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </SnackbarProvider>
        </ApolloProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

if ('serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/serviceWorker.js', {scope: '/'})
}
