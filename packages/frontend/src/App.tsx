import * as React from 'react'
import { Container, styled } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
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

export default function App() {
  return (
    <>
      <ScrollToTop/>
      <Root>
        <Header/>
        <Container fixed sx={{minHeight: 'calc(100vh - 276px)', p: '20px 16px 0', color: 'text.primary'}}>
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/person/:id" element={<PersonInfo/>}/>
            <Route path="/movie/:id" element={<MovieInfo/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/profile/watchlist" element={<Watchlist/>}/>
            <Route path="/profile/watched" element={<WatchedMovies/>}/>
          </Routes>
        </Container>
        <Footer/>
      </Root>
    </>
  )
}

const Root = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.background.default
}))

