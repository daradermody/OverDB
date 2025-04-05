import { Box, Typography } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { trpc } from '../queryClient.ts'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import useUser from '../useUser'

export function LikedMovies({username}: { username: string }) {
  const {user} = useUser()
  const {data, error, isLoading, isFetching, refetch, hasNextPage, fetchNextPage} = useInfiniteQuery(
    trpc.likedMovies.infiniteQueryOptions({username, limit: 24}, {getNextPageParam: lastPage => lastPage.nextCursor})
  )
  const likedMovies = useMemo(() => data?.pages.map(page => page.items).flat(), [data]);

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (likedMovies && !likedMovies.length) {
    return (
      <Box mb="30px">
        <Typography variant="body1">
          {user?.username === username ? 'You have no liked movies.' : 'This person has no liked movies'}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <MovieCards movies={likedMovies} loading={isLoading}/>
      <FetchMoreButton fetchMore={fetchNextPage} endReached={!hasNextPage} loading={isFetching}/>
    </>
  )
}
