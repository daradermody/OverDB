import {gql} from "@apollo/client";
import {Skeleton, ToggleButton, ToggleButtonGroup} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {Person, PersonCredit, useGetPersonCreditsQuery} from "../../types/graphql";
import MovieCards from "../shared/cards/MovieCard";
import ApiErrorMessage from '../shared/ApiErrorMessage'

export function MovieList({id}: { id: Person['id'] }) {
  const {data, error, loading} = useGetPersonCreditsQuery({variables: {id}})
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  const roles = loading ? [] : extractUniqueRoles(data.creditsForPerson)
  const filteredMovies = loading ? [] : data.creditsForPerson
    .filter(movie => !selectedRoles.length || selectedRoles.every(role => movie.jobs.includes(role)))

  return (
    <div>
      <div style={{display: 'flex', marginBottom: 10, justifyContent: 'right'}}>
        <ToggleFilter options={roles} value={selectedRoles} onChange={setSelectedRoles}/>
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
      <ToggleButtonGroup
        sx={{mb: 2}}
        value={value}
        onChange={(_, values) => onChange(values)}
      >
        {options.map(option => <ToggleButton key={option} value={option}>{option}</ToggleButton>)}
      </ToggleButtonGroup>
    )
  }
}

function extractUniqueRoles(movies: { jobs: PersonCredit['jobs'] }[]): string[] {
  const roles = new Set<string>()
  for (let movie of movies) {
    for (let job of movie.jobs) {
      roles.add(job)
    }
  }
  return Array.from(roles)
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