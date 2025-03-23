import styled from '@emotion/styled'
import {Box} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import {useLocation} from 'react-router'
import {useNavigate} from 'react-router-dom'
import {ThingType} from '../../../apiTypes.ts'
import type {CrewCredit, Person} from '../../types/graphql'
import {trpc} from '../queryClient.ts'
import {MovieCards} from '../shared/cards'
import {ErrorMessage} from '../shared/errorHandlers'
import ToggleFilter from '../shared/ToggleFilter'

export function MovieList({id}: { id: Person['id'] }) {
  const {data, error, isLoading, refetch} = useQuery(trpc.movieCreditsForPerson.queryOptions({id}))
  const credits = data || []
  const navigate = useNavigate()
  const location = useLocation()

  const roles = useMemo(() => extractUniqueRoles(credits).sort(sortJobs), [credits])
  const onlyActed = roles.length === 1 && roles[0] === 'Actor'
  const selectedRoles: string[] = location.state?.roles || (onlyActed ? ['Actor'] : [])
  const filteredMovieCredits = useMemo(
    () => credits
      .filter(credit => !selectedRoles.length || selectedRoles.every(role => credit.jobs.includes(role)))
      .map(credit => ({ ...credit.movie, type: ThingType.Movie, jobs: credit.jobs, characters: credit.characters })),
    [credits, selectedRoles]
  )

  if (error) return <ErrorMessage error={error} onRetry={refetch}/>

  return (
    <div>
      <Scrollable>
        <Box flexGrow="1"/>
        <Filters>
          <ToggleFilter
            loading={isLoading}
            options={roles.filter(r => r !== 'Actor')}
            value={selectedRoles}
            onChange={(_, roles: string[]) => {
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
      <MovieCards movies={filteredMovieCredits} loading={isLoading} showCharactersOnly={selectedRoles.includes('Actor')}/>
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

function extractUniqueRoles(credits: { jobs: string[] }[]): string[] {
  return Array.from(new Set(credits.map(credit => credit.jobs).flat()))
}

function sortJobs(jobA: CrewCredit['jobs'][number], jobB: CrewCredit['jobs'][number]): number {
  const jobsByImportance = ['Casting', 'Editor', 'Music', 'Sound', 'Producer', 'Cinematography', 'Writer', 'Director']
  const jobAPrecedence = jobsByImportance.findIndex(importantJob => jobA === importantJob)
  const jobBPrecedence = jobsByImportance.findIndex(importantJob => jobB === importantJob)
  return jobAPrecedence > jobBPrecedence ? -1 : 1
}
