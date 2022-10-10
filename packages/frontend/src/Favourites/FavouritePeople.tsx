import * as React from 'react'
import { Box, Link, Typography } from '@mui/material'
import { LoadingPeople, PersonCard } from '../shared/cards/PersonCard'
import { gql } from '@apollo/client'
import { useGetFavouritePeopleQuery } from '../../types/graphql'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import { StyledCardListWrapper } from '../shared/styledComponents'

export function FavouritePeople() {
  const {data, error, loading} = useGetFavouritePeopleQuery()

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  if (data && !data.favouritePeople.length) {
    return (
      <Box mb="30px">
        <Typography variant="body1">You have no people favourited. Here are some suggestions:</Typography>
        <ul>
          <li><Typography variant="body1"><Link href="/person/488">Steven Spielberg</Link></Typography></li>
          <li><Typography variant="body1"><Link href="/person/13520">Aaron Sorkin</Link></Typography></li>
          <li><Typography variant="body1"><Link href="/person/151">Roger Deakins</Link></Typography></li>
        </ul>
      </Box>
    )
  }

  return (
    <StyledCardListWrapper>
      {loading ? <LoadingPeople/> : data.favouritePeople.map(person => <PersonCard key={person.id} person={person}/>)}
    </StyledCardListWrapper>
  )
}

gql`
  query GetFavouritePeople {
    favouritePeople {
      id
      profilePath
      name
    }
  }
`
