import { gql } from '@apollo/client'
import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useGetWatchedMoviesQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import PageWrapper from '../shared/PageWrapper'

export default function WatchedMovies() {
  const {data, error, loading, fetchMore} = useGetWatchedMoviesQuery({
    variables: {offset: 0, limit: 24},
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })
  const initialLoading = loading && !data

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Watched movies</Typography>
      <MovieCards movies={data?.watched?.results} loading={loading && !data} loadingCount={24}/>
      <div style={{display: initialLoading || data.watched.endReached ? 'none' : 'flex', justifyContent: 'center', marginTop: 20}}>
        {!initialLoading && !data.watched.endReached && (
          <LoadingButton
            loading={loading}
            variant="outlined"
            onClick={() => fetchMore({variables: {offset: data?.watched?.results?.length}})}
          >
            Show More
          </LoadingButton>
        )}
      </div>
    </PageWrapper>
  )
}

gql`
  query GetWatchedMovies($offset: Int, $limit: Int) {
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
`
