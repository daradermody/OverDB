import * as React from 'react'
import { ReactNode, useEffect, useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
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
import styled from '@emotion/styled'
import useIsOnline from './shared/useIsOnline'
import Favourites from './Favourites/Favourites'

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
          {true ? <AppRoutes/> : <Offline/>}
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
      <Route path="/profile/favourites" element={authed(<Favourites/>)}/>
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

function Offline() {
  return (
    <StyledOfflineContainer fixed>
      <Typography variant="h1" fontSize="3rem">You are offline</Typography>
      <img src="/offline.png" alt="offline" style={{ maxWidth: '100%'}}/>
    </StyledOfflineContainer>
  )
}

const StyledOfflineContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 95%;
  gap: 50px;
`

const Root = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.background.default
}))

