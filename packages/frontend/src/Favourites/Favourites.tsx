import { Box, Tab, Tabs, Typography } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import PageWrapper from '../shared/PageWrapper'
import { FavouritePeople } from './FavouritePeople'
import { LikedMovies } from './LikedMovies'

export default function Favourites() {
  const [tab, setTab] = useState(0)

  return (
    <PageWrapper>
      <Typography variant="h1">Favourites</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(e, value) => setTab(value)}>
          <Tab label="People"/>
          <Tab label="Movies"/>
        </Tabs>
      </Box>
      {tab === 0 && <FavouritePeople/>}
      {tab === 1 && <LikedMovies/>}
    </PageWrapper>
  )
}
