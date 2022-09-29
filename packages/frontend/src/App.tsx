import * as React from 'react'
import { ReactNode } from 'react'
import { Box, styled } from '@mui/material'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './Footer/Footer'
import { PersonInfo } from './personInfo/PersonInfo'
import { Homepage } from './homepage/Homepage'
import { MovieInfo } from './movieInfo/MovieInfo'
import { Header } from './header/Header'
import Profile from './Profile/Profile'
import ScrollToTop from './shared/general/ScrollToTop'
import WatchedMovies from './WatchedMovies/WatchedMovies'
import Watchlist from './watchlist/Watchlist'
import Login from './Login'
import { userSignal } from './useUser'

export default function App() {
  return (
    <>
      <ScrollToTop/>
      <Root>
        <Header/>
        <Box sx={{minHeight: 'calc(100vh - 276px)', color: 'text.primary', pt: 4}}>
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/person/:id" element={authed(<PersonInfo/>)}/>
            <Route path="/movie/:id" element={authed(<MovieInfo/>)}/>
            <Route path="/profile" element={authed(<Profile/>)}/>
            <Route path="/profile/watchlist" element={authed(<Watchlist/>)}/>
            <Route path="/profile/watched" element={authed(<WatchedMovies/>)}/>
          </Routes>
        </Box>
        <Footer/>
      </Root>
    </>
  )
}

function authed(children: ReactNode) {
  const location = useLocation()
  if (!userSignal.value) {
    return <Navigate replace to={`/login?andWeWillGetYouTo=${location.pathname}`}/>
  }
  return <div>{children}</div>
}

const Root = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.background.default
}))
