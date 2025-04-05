import {Typography} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {useParams} from 'react-router-dom'
import {trpc} from '../queryClient.ts'
import MoviesPeopleCards from '../shared/cards/MoviesPeopleCards'
import {ErrorMessage} from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'
import useSetTitle from '../shared/useSetTitle'

export function SearchPage() {
  const query = useParams<{ query: string }>().query!
  const {data, isLoading, error, refetch} = useQuery(trpc.search.queryOptions(query))
  useSetTitle(`Search for ${query}`)

  if (data?.length === 0) {
    return (
      <PageWrapper>
        <Typography variant="h1">Sorry, no results found for "{query}"</Typography>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Typography variant="h1">Results for "{query}"</Typography>
      <div>
        {error && <ErrorMessage error={error} onRetry={refetch}/>}
        {!error && <MoviesPeopleCards moviesAndPeople={data} loading={isLoading}/>}
      </div>
    </PageWrapper>
  )
}
