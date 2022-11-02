import { gql } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useGetLikedMoviesQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import { ErrorMessage } from '../shared/errorHandlers'

export function LikedMovies() {
  const {data, error, loading, refetch} = useGetLikedMoviesQuery()

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (data && !data.likedMovies.length) {
    return (
      <Box mb="30px">
        <Typography variant="body1">You have no liked films.</Typography>
      </Box>
    )
  }

  return <MovieCards movies={data?.likedMovies} loading={loading}/>
}

gql`
  query GetLikedMovies {
    likedMovies {
      id
      title
      posterPath
      releaseDate
    }
  }
`
