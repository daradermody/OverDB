import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useGetWatchlistQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'

export default function Watchlist() {
  const {data, error, loading, refetch} = useGetWatchlistQuery()

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Watchlist</Typography>
      <MovieCards movies={data?.watchlist} loading={loading} loadingCount={6}/>
    </PageWrapper>
  )
}

gql`
  query GetWatchlist {
    watchlist {
      id
      title
      posterPath
      releaseDate
      watched
      inWatchlist
      sentiment
    }
  }
`
