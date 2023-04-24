import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetWatchedMoviesQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import PageWrapper from '../shared/PageWrapper'

export default function WatchedMovies() {
  const {username} = useParams<{ username: string }>()
  const {data, error, loading, refetch, fetchMore} = useGetWatchedMoviesQuery({
    variables: {username},
    notifyOnNetworkStatusChange: true,
  })

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Watched movies</Typography>
      <MovieCards movies={data?.user.watched.results} loading={loading && !data} loadingCount={24}/>
      <FetchMoreButton
        fetchMore={fetchMore}
        currentLength={data?.user.watched.results.length}
        endReached={data?.user.watched.endReached}
        loading={loading}
      />
    </PageWrapper>
  )
}

gql`
  query GetWatchedMovies($username: String!, $offset: Int, $limit: Int) {
    user(username: $username) {
      watched(offset: $offset, limit: $limit) {
        endReached
        results {
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
  }
`
