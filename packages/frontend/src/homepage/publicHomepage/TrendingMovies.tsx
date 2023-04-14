import { gql } from '@apollo/client'
import { Box } from '@mui/material'
import * as React from 'react'
import { useGetTrendingMoviesQuery } from '../../../types/graphql'
import { MovieCards } from '../../shared/cards'
import { ErrorMessage } from '../../shared/errorHandlers'
import PageWrapper from '../../shared/PageWrapper'

export function TrendingMoves() {
  const {data, loading, error, refetch} = useGetTrendingMoviesQuery({variables: {size: 12}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (loading) {
    return <span>Loading...</span>
  }

  return (
    <PageWrapper>
      <Box pt="100px">
        <MovieCards movies={data.trending}/>
      </Box>
    </PageWrapper>
  )
}

gql`
  query GetTrendingMovies($size: Int!) {
    trending(size: $size) {
      id
      title
      posterPath
      releaseDate
    }
  }
`
