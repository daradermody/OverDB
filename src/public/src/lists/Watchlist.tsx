import { gql, NetworkStatus } from '@apollo/client'
import { FilterAlt } from '@mui/icons-material'
import { Button, FormControl, InputLabel, MenuItem, Popover, Select, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useState } from 'react'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetSubscribedStreamingProvidersQuery, useGetWatchlistQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle';
import useUser from '../useUser'

export default function Watchlist() {
  const {user} = useUser()
  const {username} = useParams<{ username: string }>()
  const {data, error, loading, networkStatus, refetch, fetchMore, variables} = useGetWatchlistQuery({
    variables: {username},
    notifyOnNetworkStatusChange: true
  })
  const {data: providerData} = useGetSubscribedStreamingProvidersQuery()
  useSetTitle(user?.username === username ? `Watchlist` : `${username}'s watchlist`)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="h1">
          {user?.username === username ? 'Watchlist' : <UserBadge username={username}>{username}'s watchlist</UserBadge>}
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
        movies={data?.user.watchlist.results}
        loading={[NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus)}
        loadingCount={12}
      />
      <FetchMoreButton
        fetchMore={fetchMore}
        currentLength={networkStatus !== NetworkStatus.setVariables && data?.user.watchlist.results.length}
        endReached={data?.user.watchlist.endReached}
        loading={loading}
      />
    </PageWrapper>
  )
}

function FilterButton({filterStreamable, onFilterStreamableChange}: {filterStreamable: boolean, onFilterStreamableChange: (filterStreamable: boolean) => void}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  return (
    <>
      <Button variant="outlined" endIcon={<FilterAlt />} onClick={e => setAnchorEl(e.target as any)}>
        Filter
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <div style={{display: 'flex', gap: '16px', flexDirection: 'column', margin: '24px', minWidth: '300px'}}>
          <Typography variant="h6">Filters</Typography>

          <FormControl fullWidth>
            <InputLabel id="filter-streamable">Filter streamable</InputLabel>
            <Select
              id="filter-streamable"
              value={filterStreamable ? 'show-streamable' : 'show-all'}
              label="Filter streamable"
              onChange={() => onFilterStreamableChange(!filterStreamable)}
            >
              <MenuItem value="show-all">Show all</MenuItem>
              <MenuItem value="show-streamable">Show streamable</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Popover>
    </>
  )
}

gql`
  query GetWatchlist($username: ID!, $offset: Int, $limit: Int, $filteredByProviders: Boolean) {
    user(username: $username) {
      watchlist(offset: $offset, limit: $limit, filteredByProviders: $filteredByProviders) {
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

gql`
  query GetSubscribedStreamingProviders {
    settings {
      streaming {
        providers
      }
    }
  }
`
