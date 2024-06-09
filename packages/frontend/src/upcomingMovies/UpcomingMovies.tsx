import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useGetUpcomingMoviesQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'
import useSetTitle from '../shared/useSetTitle';

export default function UpcomingMovies() {
  const {data, error, loading, refetch} = useGetUpcomingMoviesQuery()
  useSetTitle('Upcoming movies')

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Upcoming movies</Typography>
      <Typography sx={{mb: 4}}>Here are movies from your favourite people that have not been released yet</Typography>
      <MovieCards movies={data?.upcoming} loading={loading}/>
    </PageWrapper>
  )
}

gql`
  query GetUpcomingMovies {
    upcoming {
      id
      title
      posterPath
      releaseDate
    }
  }
`
