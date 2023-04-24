import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetWatchedMoviesQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useUser from '../useUser'

export default function WatchedMovies() {
  const {user} = useUser()
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
      <Typography variant="h1">
        {user?.username === username ? 'Watched movies' : <UserBadge username={username}>{username}'s watched movies</UserBadge>}
      </Typography>
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
