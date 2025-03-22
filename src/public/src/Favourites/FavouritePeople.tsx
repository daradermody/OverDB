import { gql } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useGetFavouritePeopleQuery, type User } from '../../types/graphql'
import { PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import Link from '../shared/general/Link'
import useUser from '../useUser'

export function FavouritePeople({username}: { username: User['username'] }) {
  const {user} = useUser()
  const {data, error, loading, refetch, fetchMore} = useGetFavouritePeopleQuery({
    variables: {username},
    notifyOnNetworkStatusChange: true
  })

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (data && !data.user.favouritePeople.results.length) {
    if (user.username === username) {
      return (
        <Box mb="30px">
          <Typography variant="body1">You have no people favourited. Here are some suggestions:</Typography>
          <ul>
            <li><Typography variant="body1"><Link to="/person/488">Steven Spielberg</Link></Typography></li>
            <li><Typography variant="body1"><Link to="/person/13520">Aaron Sorkin</Link></Typography></li>
            <li><Typography variant="body1"><Link to="/person/151">Roger Deakins</Link></Typography></li>
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

  return (
    <>
      <PersonCards people={data?.user.favouritePeople.results} loading={loading && !data}/>
      <FetchMoreButton
        fetchMore={fetchMore}
        currentLength={data?.user.favouritePeople.results.length}
        endReached={data?.user.favouritePeople.endReached}
        loading={loading}
      />
    </>
  )
}

gql`
  query GetFavouritePeople($username: ID!, $offset: Int, $limit: Int) {
    user(username: $username) {
      favouritePeople(offset: $offset, limit: $limit) {
        endReached
        results {
          id
          profilePath
          name
        }
      }
    }
  }
`
