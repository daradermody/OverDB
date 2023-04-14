import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Box } from '@mui/material'
import * as React from 'react'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { CrewCredit, Person, useGetPersonCreditsQuery } from '../../types/graphql'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import ToggleFilter from '../shared/ToggleFilter'

export function MovieList({id}: { id: Person['id'] }) {
  const {data, error, loading, refetch} = useGetPersonCreditsQuery({variables: {id}})
  const navigate = useNavigate()
  const location = useLocation()

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  const roles = loading ? [] : extractUniqueRoles(data.creditsForPerson).sort(sortJobs)
  const onlyActed = roles.length === 1 && roles[0] === 'Actor'
  const selectedRoles: string[] = location.state?.roles || (
    onlyActed ? ['Actor'] : []
  )
  const filteredMovies = loading ? [] : data.creditsForPerson
    .filter(movie => !selectedRoles.length || selectedRoles.every(role => movie.jobs.includes(role)))

  return (
    <div>
      <Scrollable>
        <Box flexGrow="1"/>
        <Filters>
          <ToggleFilter
            loading={loading}
            options={roles.filter(r => r !== 'Actor')}
            value={selectedRoles}
            onChange={(_, roles) => {
              navigate(location, {state: {roles: roles.filter(r => r !== 'Actor')}, replace: true})
            }}
          />
          {roles.includes('Actor') && (
            <ToggleFilter
              disabled={onlyActed}
              options={['Actor']}
              value={selectedRoles}
              onChange={(_, roles) => {
                const newRoles = roles.includes('Actor') ? ['Actor'] : roles
                navigate(location, {state: {roles: newRoles}, replace: true})
              }}
            />
          )}
        </Filters>
      </Scrollable>
      <MovieCards movies={filteredMovies} loading={loading} showCharactersOnly={selectedRoles.includes('Actor')}/>
    </div>
  )
}

const Scrollable = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 16px;

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

const Filters = styled.div`
  display: flex;
  justify-content: right;
  gap: 20px;
  width: fit-content;
`

function extractUniqueRoles(movies: { jobs: CrewCredit['jobs'] }[]): CrewCredit['jobs'] {
  return Array.from(new Set(movies.map(m => m.jobs).flat()))
}

function sortJobs(jobA: CrewCredit['jobs'][number], jobB: CrewCredit['jobs'][number]): number {
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
      character
    }
  }
`
