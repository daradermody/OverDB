import { Box, Typography } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { trpc } from '../queryClient.ts'
import { PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import Link from '../shared/general/Link'
import useUser from '../useUser'

export function FavouritePeople({username}: { username: string }) {
  const {user} = useUser()
  const {data, isLoading, isFetching, error, refetch, hasNextPage, fetchNextPage} = useInfiniteQuery(
    trpc.favouritePeople.infiniteQueryOptions({username, limit: 24}, {getNextPageParam: lastPage => lastPage.nextCursor})
  )
  const favouritePeople = useMemo(() => data?.pages.map(page => page.items).flat(), [data]);

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }


  if (favouritePeople && !favouritePeople.length) {
    if (user?.username === username) {
      return (
        <Box mb="30px">
          <Typography variant="body1">You have no people favourited. Here are some suggestions:</Typography>
          <ul>
            <li><Typography variant="body1"><Link to="/person/488">Steven Spielberg</Link></Typography></li>
            <li><Typography variant="body1"><Link to="/person/13520">Aaron Sorkin</Link></Typography></li>
            <li><Typography variant="body1"><Link to="/person/151">Roger Deakins</Link></Typography></li>
          </ul>
        </Box>
      )
    } else {
      return (
        <Box mb="30px">
          <Typography variant="body1">This person has no people favourited yet.</Typography>
        </Box>
      )
    }
  }

  return (
    <>
      <PersonCards people={favouritePeople} loading={isLoading}/>
      <FetchMoreButton fetchMore={fetchNextPage} endReached={!hasNextPage} loading={isFetching}/>
    </>
  )
}
