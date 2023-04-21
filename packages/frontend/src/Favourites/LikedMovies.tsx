import { gql } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useGetLikedMoviesQuery, User } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import useUser from '../useUser'

export function LikedMovies({username}: {username: User['username']}) {
  const {user} = useUser()
  const {data, error, loading, refetch} = useGetLikedMoviesQuery({variables: {username}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (data && !data.user.likedMovies.length) {
    return (
      <Box mb="30px">
        <Typography variant="body1">
          {user.username === username ? 'You have no liked movies.' : 'This person has no liked movies'}
        </Typography>
      </Box>
    )
  }

  return <MovieCards movies={data?.user.likedMovies} loading={loading}/>
}

gql`
  query GetLikedMovies($username: String!) {
    user(username: $username) {
      likedMovies {
        id
        title
        posterPath
        releaseDate
      }
    }
  }
`
