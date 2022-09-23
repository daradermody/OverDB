import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useGetWatchlistQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import ApiErrorMessage from '../shared/ApiErrorMessage'

export default function Watchlist() {
  const {data, error, loading} = useGetWatchlistQuery({fetchPolicy: "network-only"})

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  return (
    <div>
      <Typography variant="h1">Watchlist</Typography>
      <MovieCards movies={data?.watchlist} loading={loading} loadingCount={6}/>
    </div>
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
