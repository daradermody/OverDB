import { gql, NetworkStatus } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetListQuery, useGetSubscribedStreamingProvidersQuery } from '../../types/graphql'
import MoviesPeopleCards, { MovieCards } from '../shared/cards/MoviesPeopleCards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useUser from '../useUser'
import FilterButton from './FilterButton'

export default function List() {
  const {user} = useUser()
  const {id, username} = useParams<{ id: string, username: string }>()
  const {data, error, loading, networkStatus, refetch, fetchMore, variables} = useGetListQuery({
    variables: {id, username},
    notifyOnNetworkStatusChange: true
  })

  const {data: providerData} = useGetSubscribedStreamingProvidersQuery()

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="h1">
          {user?.username === username ? data?.user.list.name : <UserBadge username={username}>{username}'s {data?.user.list.name}</UserBadge>}
        </Typography>
        {user?.username === username && providerData?.settings?.streaming?.providers && (
          <FilterButton
            filterStreamable={variables.filteredByProviders}
            onFilterStreamableChange={filteredByProviders => {
              void refetch({offset: 0, filteredByProviders})
            }}
          />
        )}
      </div>

      <MovieCards
        movies={data?.user.list.items.results}
        loading={[NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus)}
        loadingCount={12}
      />
      <FetchMoreButton
        fetchMore={fetchMore}
        currentLength={networkStatus !== NetworkStatus.setVariables && data?.user.list.items.results.length}
        endReached={data?.user.list.items.endReached}
        loading={loading}
      />
    </PageWrapper>
  )
}

gql`
  query GetList($username: ID!, $id: ID!, $offset: Int, $limit: Int, $filteredByProviders: Boolean) {
    user(username: $username) {
      list(id: $id) {
        id
        name
        type
        items(offset: $offset, limit: $limit, filteredByProviders: $filteredByProviders) {
          endReached
          results {
            id
            posterPath
            title
            releaseDate
            watched
            inWatchlist
            sentiment
          }
        }
      }
    }
  }
`

gql`
  query GetSubscribedStreamingProviders {
    settings {
      streaming {
        providers
      }
    }
  }
`
