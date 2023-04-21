import { gql } from '@apollo/client'
import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetWatchedMoviesQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'

export default function WatchedMovies() {
  const {username} = useParams<{ username: string }>()
  const {data, error, loading, refetch, fetchMore} = useGetWatchedMoviesQuery({
    variables: {offset: 0, limit: 24, username},
    notifyOnNetworkStatusChange: true,
  })
  const initialLoading = loading && !data

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Watched movies</Typography>
      <MovieCards movies={data?.user.watched.results} loading={loading && !data} loadingCount={24}/>
      <div style={{display: initialLoading || data.user.watched.endReached ? 'none' : 'flex', justifyContent: 'center', marginTop: 20}}>
        {!initialLoading && !data.user.watched.endReached && (
          <LoadingButton
            loading={loading}
            variant="outlined"
            onClick={() => fetchMore({variables: {offset: data?.user.watched.results.length}})}
          >
            Show More
          </LoadingButton>
        )}
      </div>
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
