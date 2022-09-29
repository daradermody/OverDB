import { useGetTrendingMoviesQuery } from '../../../types/graphql'
import PageWrapper from '../../shared/PageWrapper'
import MovieCards from '../../shared/cards/MovieCard'
import * as React from 'react'
import { gql } from '@apollo/client'
import { Box } from '@mui/material'

export function TrendingMoves() {
  const {data, loading} = useGetTrendingMoviesQuery()
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
  query GetTrendingMovies {
    trending {
      id
      title
      posterPath
      releaseDate
    }
  }
`
