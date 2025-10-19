import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '../queryClient.ts'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'
import useSetTitle from '../shared/useSetTitle'

export default function UpcomingMovies() {
  const {data, isLoading, error, refetch} = useQuery(trpc.upcomingMovies.queryOptions())
  useSetTitle('Upcoming movies')

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Upcoming movies</Typography>
      <Typography sx={{mb: 4}}>Here are movies from your favourite people that have not been released yet</Typography>
      <MovieCards movies={data} loading={isLoading} showExactDate/>
    </PageWrapper>
  )
}
