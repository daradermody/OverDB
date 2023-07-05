import { gql } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useGetLikedMoviesQuery, User } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import useUser from '../useUser'

export function LikedMovies({username}: { username: User['username'] }) {
  const {user} = useUser()
  const {data, error, loading, refetch, fetchMore} = useGetLikedMoviesQuery({
    variables: {username},
    notifyOnNetworkStatusChange: true
  })

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (data && !data.user.likedMovies.results.length) {
    return (
      <Box mb="30px">
        <Typography variant="body1">
          {user.username === username ? 'You have no liked movies.' : 'This person has no liked movies'}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <MovieCards movies={data?.user.likedMovies.results} loading={loading && !data}/>
      <FetchMoreButton
        fetchMore={fetchMore}
        currentLength={data?.user.likedMovies.results.length}
        endReached={data?.user.likedMovies.endReached}
        loading={loading}
      />
    </>
  )
}

gql`
  query GetLikedMovies($username: ID!, $offset: Int, $limit: Int) {
    user(username: $username) {
      likedMovies(offset: $offset, limit: $limit) {
        endReached
        results {
          id
          title
          posterPath
          releaseDate
        }
      }
    }
  }
`
