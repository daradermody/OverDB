import { gql } from '@apollo/client'
import { Box, Link, Typography } from '@mui/material'
import * as React from 'react'
import { useGetFavouritePeopleQuery } from '../../types/graphql'
import { PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'

export function FavouritePeople() {
  const {data, error, loading, refetch} = useGetFavouritePeopleQuery()

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (data && !data.favouritePeople.length) {
    return (
      <Box mb="30px">
        <Typography variant="body1">You have no people favourited. Here are some suggestions:</Typography>
        <ul>
          <li><Typography variant="body1"><Link href="/person/488">Steven Spielberg</Link></Typography></li>
          <li><Typography variant="body1"><Link href="/person/13520">Aaron Sorkin</Link></Typography></li>
          <li><Typography variant="body1"><Link href="/person/151">Roger Deakins</Link></Typography></li>
        </ul>
      </Box>
    )
  }

  return <PersonCards people={data?.favouritePeople} loading={loading}/>
}

gql`
  query GetFavouritePeople {
    favouritePeople {
      id
      profilePath
      name
    }
  }
`
