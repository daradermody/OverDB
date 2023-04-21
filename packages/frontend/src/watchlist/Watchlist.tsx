import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetWatchlistQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'

export default function Watchlist() {
  const {username} = useParams<{ username: string }>()
  const {data, error, loading, refetch} = useGetWatchlistQuery({variables: {username}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Watchlist</Typography>
      <MovieCards movies={data?.user.watchlist} loading={loading} loadingCount={6}/>
    </PageWrapper>
  )
}

gql`
  query GetWatchlist($username: String!) {
    user(username: $username) {
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
  }
`
