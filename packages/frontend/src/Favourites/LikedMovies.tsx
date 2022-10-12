import { gql } from '@apollo/client'
import { Box, Typography } from '@mui/material'
import * as React from 'react'
import { useGetLikedMoviesQuery } from '../../types/graphql'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import MovieCards from '../shared/cards/MovieCard'

export function LikedMovies() {
  const {data, error, loading} = useGetLikedMoviesQuery()

  if (error) {
    return <ApiErrorMessage error={error}/>
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
