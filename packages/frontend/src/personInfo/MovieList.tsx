import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import * as React from 'react'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Person, PersonCredit, useGetPersonCreditsQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import { ErrorMessage } from '../shared/errorHandlers'

export function MovieList({id}: { id: Person['id'] }) {
  const {data, error, loading, refetch} = useGetPersonCreditsQuery({variables: {id}})
  const navigate = useNavigate()
  const location = useLocation()
  const selectedRoles: string[] = location.state?.roles || []

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  const roles = loading ? [] : extractUniqueRoles(data.creditsForPerson).sort(sortJobs)
  const filteredMovies = loading ? [] : data.creditsForPerson
    .filter(movie => !selectedRoles.length || selectedRoles.every(role => movie.jobs.includes(role)))

  return (
    <div>
      <div style={{display: 'flex', marginBottom: 10, justifyContent: 'right'}}>
        <ToggleFilter
          options={roles}
          value={selectedRoles}
          onChange={roles => navigate(location, {state: {roles}, replace: true})}
        />
      </div>
      <MovieCards movies={filteredMovies} loading={loading}/>
    </div>
  )
}

interface ToggleFilterProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  loading?: boolean
}

function ToggleFilter({options, value, onChange, loading}: ToggleFilterProps) {
  if (loading) {
    return (
      <div style={{gap: 1, display: 'flex', borderRadius: 4}}>
        <Skeleton variant="rectangular" height={48} width={93}/>
        <Skeleton variant="rectangular" height={48} width={93}/>
        <Skeleton variant="rectangular" height={48} width={93}/>
      </div>
    )
  } else {
    return (
      <StyledButtonGroup value={value} onChange={(_, values) => onChange(values)}>
        {options.map(option => <ToggleButton key={option} value={option}>{option}</ToggleButton>)}
      </StyledButtonGroup>
    )
  }
}

const StyledButtonGroup = styled(ToggleButtonGroup)`
  margin-bottom: 16px;
  overflow-x: auto;

  @media (pointer: fine) {
    &::-webkit-scrollbar {
      background-color: ${({theme}) => theme.palette.background.default};
      border-radius: 3px;
      -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.4);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
`

function extractUniqueRoles(movies: { jobs: PersonCredit['jobs'] }[]): PersonCredit['jobs'] {
  return Array.from(new Set(movies.map(m => m.jobs).flat()))
}

function sortJobs(jobA: PersonCredit['jobs'][number], jobB: PersonCredit['jobs'][number]): number {
  const jobsByImportance = ['Casting', 'Editor', 'Music', 'Sound', 'Producer', 'Cinematography', 'Writer', 'Director']
  const jobAPrecedence = jobsByImportance.findIndex(importantJob => jobA === importantJob)
  const jobBPrecedence = jobsByImportance.findIndex(importantJob => jobB === importantJob)
  return jobAPrecedence > jobBPrecedence ? -1 : 1
}

gql`
  query GetPersonCredits($id: ID!) {
    creditsForPerson(id: $id) {
      id
      title
      watched
      inWatchlist
      sentiment
      posterPath
      releaseDate
      jobs
    }
  }
`
