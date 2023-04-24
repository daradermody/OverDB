import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetWatchlistQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useUser from '../useUser'

export default function Watchlist() {
  const {user} = useUser()
  const {username} = useParams<{ username: string }>()
  const {data, error, loading, refetch, fetchMore} = useGetWatchlistQuery({
    variables: {username},
    notifyOnNetworkStatusChange: true
  })

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">
        {user?.username === username ? 'Watchlist' : <UserBadge username={username}>{username}'s watchlist</UserBadge>}
      </Typography>
      <MovieCards movies={data?.user.watchlist.results} loading={loading && !data} loadingCount={6}/>
      <FetchMoreButton
        fetchMore={fetchMore}
        currentLength={data?.user.watchlist.results.length}
        endReached={data?.user.watchlist.endReached}
        loading={loading}
      />
    </PageWrapper>
  )
}

gql`
  query GetWatchlist($username: String!, $offset: Int, $limit: Int) {
    user(username: $username) {
      watchlist(offset: $offset, limit: $limit) {
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
