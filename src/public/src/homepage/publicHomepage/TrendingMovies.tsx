import {Box} from '@mui/material'
import {MovieCards} from '../../shared/cards'
import {ErrorMessage} from '../../shared/errorHandlers'
import PageWrapper from '../../shared/PageWrapper'
import {useQuery} from '@tanstack/react-query'
import {trpc} from '../../queryClient.ts'

export function TrendingMoves() {
  const {data, isLoading, error, refetch} = useQuery(trpc.trendingMovies.queryOptions({size: 12}))

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <PageWrapper>
      <Box pt="100px">
        <MovieCards movies={data}/>
      </Box>
    </PageWrapper>
  )
}
