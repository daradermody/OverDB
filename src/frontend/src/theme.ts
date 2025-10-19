import { createTheme } from '@mui/material'

export default createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a1929'
    },
    primary: {
      main: '#b16bda'
    },
    secondary: {
      main: '#0a1929'
    }
  },
  typography: {
    h1: {
      fontSize: 28,
      margin: '20px 0',
    },
    h2: {
      fontSize: 24,
      margin: '10px 0',
    },
    subtitle1: {
      color: '#9ab',
    },
    subtitle2: {
      color: '#678',
    },
  }
})
