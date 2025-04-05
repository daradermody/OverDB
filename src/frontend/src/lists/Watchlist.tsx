import { FilterAlt } from '@mui/icons-material'
import { Button, FormControl, InputLabel, MenuItem, Popover, Select, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ListType } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { MovieCards, PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser'

export default function Watchlist() {
  const {user} = useUser()
  const username = useParams<{ username: string }>().username!
  const [filterItemsByProvider, setFilterItemsByProvider] = useState(false)
  const {data: list, error, isLoading, refetch} = useQuery(trpc.list.queryOptions({username, id: 'watchlist', filterItemsByProvider}))
  const {data: userSettings} = useQuery(trpc.userSettings.queryOptions(undefined, {enabled: user?.username === username}))
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
        {user?.username === username && userSettings?.streaming?.providers && (
          <FilterButton filterStreamable={filterItemsByProvider} onFilterStreamableChange={setFilterItemsByProvider}/>
        )}
      </div>
      {list?.type === ListType.Movie ? (
        <MovieCards movies={list?.items} loading={isLoading} loadingCount={12}/>
      ) : (
        <PersonCards people={list?.items} loading={isLoading} loadingCount={12}/>
      )}
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
