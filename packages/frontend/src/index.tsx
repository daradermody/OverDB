import { ApolloProvider } from '@apollo/client'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import * as React from 'react'
import App from './App'
import theme from './theme'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import apollotClient from './apollotClient'

document.body.style.fontFamily = 'Roboto'
document.body.style.margin = '0'
document.body.style.backgroundColor = theme.palette.background.default

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apollotClient}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </ApolloProvider>
    </ThemeProvider>
  </StyledEngineProvider>
)
