import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { ListType } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { MovieCards, PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser'

export default function List() {
  const {user} = useUser()
  const {id, username} = useParams<{ id: string, username: string }>()
  const {data: list, isLoading, error, refetch} = useQuery(trpc.list.queryOptions({username: username!, id: id!}))
  useSetTitle(list?.name)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">
        {user?.username === username ? list?.name : <UserBadge username={username!}>{username}'s {list?.name}</UserBadge>}
      </Typography>

      {list?.type === ListType.Movie ? (
        <MovieCards movies={list?.items} loading={isLoading} loadingCount={12}/>
      ) : (
        <PersonCards people={list?.items} loading={isLoading} loadingCount={12}/>
      )}
      {!!list && !list?.items.length && <div>No items in this list</div>}
    </PageWrapper>
  )
}
