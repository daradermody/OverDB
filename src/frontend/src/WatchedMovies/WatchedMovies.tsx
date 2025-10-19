import { Typography } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { trpc } from '../queryClient.ts'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import FetchMoreButton from '../shared/FetchMoreButton'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser'

export default function WatchedMovies() {
  const {user} = useUser()
  const username = useParams<{ username: string }>().username!
  const {data, error, isLoading, isFetching, refetch, hasNextPage, fetchNextPage} = useInfiniteQuery(
    trpc.getWatched.infiniteQueryOptions({username, limit: 24}, {getNextPageParam: lastPage => lastPage.nextCursor})
  )
  const watchedMovies = useMemo(() => data?.pages.map(page => page.items).flat(), [data])
  useSetTitle(user?.username === username ? `Watched movies` : `${username}'s watched movies`)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">
        {user?.username === username ? 'Watched movies' : <UserBadge username={username}>{username}'s watched movies</UserBadge>}
      </Typography>
      <MovieCards movies={watchedMovies} loading={isLoading} loadingCount={24}/>
      <FetchMoreButton fetchMore={fetchNextPage} endReached={!hasNextPage} loading={isFetching}/>
    </PageWrapper>
  )
}
