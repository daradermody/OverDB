import { gql } from '@apollo/client'
import { Box, Link, Typography } from '@mui/material'
import * as React from 'react'
import { useGetFavouritePeopleQuery, User } from '../../types/graphql'
import { PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import useUser from '../useUser'

export function FavouritePeople({username}: {username: User['username']}) {
  const {user} = useUser()
  const {data, error, loading, refetch} = useGetFavouritePeopleQuery({variables: {username}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (data && !data.user.favouritePeople.length) {
    if (user.username === username) {
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
    } else {
      return (
        <Box mb="30px">
          <Typography variant="body1">This person has no people favourited yet.</Typography>
        </Box>
      )
    }
  }

  return <PersonCards people={data?.user.favouritePeople} loading={loading}/>
}

gql`
  query GetFavouritePeople($username: String!) {
    user(username: $username) {
      favouritePeople {
        id
        profilePath
        name
      }
    }
  }
`
