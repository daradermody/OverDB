import styled from '@emotion/styled'
import { Box, Container, Typography } from '@mui/material'
import * as React from 'react'
import { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Favourites from './Favourites/Favourites'
import Footer from './Footer/Footer'
import { Header } from './header/Header'
import { Homepage } from './homepage/Homepage'
import Login from './Login'
import { MovieInfo } from './movieInfo/MovieInfo'
import { PersonInfo } from './personInfo/PersonInfo'
import Profile from './Profile/Profile'
import { ErrorBoundary } from './shared/errorHandlers'
import ScrollToTop from './shared/general/ScrollToTop'
import useIsOnline from './shared/useIsOnline'
import { userSignal } from './useUser'
import WatchedMovies from './WatchedMovies/WatchedMovies'
import Watchlist from './watchlist/Watchlist'

export default function App() {
  const isOnline = useIsOnline()

  if (isOnline === undefined) {
    return null
  }

  return (
    <>
      <ScrollToTop/>
      <Root>
        <Header/>
        <Box sx={{minHeight: 'calc(100vh - 276px)', color: 'text.primary', pt: 4}}>
          <ErrorBoundary>
            <AppRoutes/>
          </ErrorBoundary>
        </Box>
        <Footer/>
      </Root>
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/person/:id" element={authed(<PersonInfo/>)}/>
      <Route path="/movie/:id" element={authed(<MovieInfo/>)}/>
      <Route path="/profile" element={authed(<Profile/>)}/>
      <Route path="/profile/favourites" element={authed(<Navigate to="/profile/favourite/people" replace/>)}/>
      <Route path="/profile/favourite/:type" element={authed(<Favourites/>)}/>
      <Route path="/profile/watchlist" element={authed(<Watchlist/>)}/>
      <Route path="/profile/watched" element={authed(<WatchedMovies/>)}/>
    </Routes>
  )
}

function authed(children: ReactNode) {
  const location = useLocation()
  if (!userSignal.value) {
    return <Navigate replace to={`/login?andWeWillGetYouTo=${location.pathname}`}/>
  }
  return <div>{children}</div>
}

const Root = styled('div')(({theme}) => (
  {
    backgroundColor: theme.palette.background.default
  }
))

