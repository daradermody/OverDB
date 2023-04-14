import { Typography } from '@mui/material'
import { useEffect } from 'react'
import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSearchQuery } from '../../types/graphql'
import MoviesPeopleCards from '../shared/cards/MoviesPeopleCards'
import { ErrorMessage } from '../shared/errorHandlers'
import PageWrapper from '../shared/PageWrapper'

export function SearchPage() {
  const query = useParams<{ query: string }>().query
  const navigate = useNavigate()
  const {data, loading, error, refetch} = useSearchQuery({variables: {query}})

  useEffect(() => {
    if (!query) navigate('/')
  }, [navigate])

  if (data?.search.length === 0) {
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
        {data && <MoviesPeopleCards moviesAndPeople={data.search} loading={loading}/>}
      </div>
    </PageWrapper>
  )
}
