import { Box, Tab, Tabs, Typography } from '@mui/material'
import * as React from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from '../shared/PageWrapper'
import { FavouritePeople } from './FavouritePeople'
import { LikedMovies } from './LikedMovies'

export default function Favourites() {
  const {type, username} = useParams<{ type: 'people' | 'movies', username: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!['people', 'movies'].includes(type)) {
      navigate(`/profile/${username}/favourite/people`, {replace: true})
    }
  })

  return (
    <PageWrapper>
      <Typography variant="h1">Favourites</Typography>
      <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
        <Tabs value={type} onChange={(e, value) => navigate(`/profile/${username}/favourite/${value}`)}>
          <Tab label="People" value="people"/>
          <Tab label="Movies" value="movies"/>
        </Tabs>
      </Box>
      {type === 'people' && <FavouritePeople username={username}/>}
      {type === 'movies' && <LikedMovies username={username}/>}
    </PageWrapper>
  )
}
