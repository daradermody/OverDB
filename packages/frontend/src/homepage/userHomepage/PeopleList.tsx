import * as React from 'react'
import { useState } from 'react'
import { Button, Collapse, Typography } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { LoadingPeople, PersonCard } from '../../shared/cards/PersonCard'
import { gql } from '@apollo/client'
import { useGetFavouritePeopleQuery } from '../../../types/graphql'
import ApiErrorMessage from '../../shared/ApiErrorMessage'
import { StyledCardListWrapper } from '../../shared/styledComponents'

export function PeopleList() {
  const [expanded, setExpanded] = useState(false)
  const {data, error, loading} = useGetFavouritePeopleQuery()

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  const buttonIcon = expanded ? <ExpandLess/> : <ExpandMore/>
  return (
    <div>
      <Typography variant="h1">Favourite People</Typography>
      <Collapse in={expanded} collapsedSize={315}>
        <StyledCardListWrapper>
          {loading ? <LoadingPeople/> : data.favouritePeople.map(person => <PersonCard key={person.id} person={person}/>)}
        </StyledCardListWrapper>
      </Collapse>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button onClick={() => setExpanded(!expanded)} startIcon={buttonIcon} endIcon={buttonIcon}>
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      </div>
    </div>
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
