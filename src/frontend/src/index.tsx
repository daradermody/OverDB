import {StyledEngineProvider, ThemeProvider} from '@mui/material/styles'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {SnackbarProvider} from 'notistack'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import theme from './theme'
import {QueryClientProvider} from '@tanstack/react-query'
import App from './App.tsx'
import {queryClient} from './queryClient.ts'

document.body.style.margin = '0'
document.body.style.backgroundColor = theme.palette.background.default

function Root() {
  return (
    <StyledEngineProvider injectFirst>
       <QueryClientProvider client={queryClient}>
         <ReactQueryDevtools initialIsOpen={false} />
         <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <BrowserRouter>
              <App/>
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StyledEngineProvider>
  )
}


const container = document.getElementById('root')!
if ((import.meta as any).hot) {
  const root = ((import.meta as any).hot.data.root ??= createRoot(container))
  root.render(<Root/>)
} else {
  createRoot(container).render(<Root/>)
}

if ('serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/serviceWorker.js', {scope: '/'})
}
