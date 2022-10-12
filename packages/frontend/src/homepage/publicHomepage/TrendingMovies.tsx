import { gql } from '@apollo/client'
import { Box } from '@mui/material'
import * as React from 'react'
import { useGetTrendingMoviesQuery } from '../../../types/graphql'
import MovieCards from '../../shared/cards/MovieCard'
import PageWrapper from '../../shared/PageWrapper'

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
