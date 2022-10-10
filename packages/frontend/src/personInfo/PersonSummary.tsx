import { gql } from '@apollo/client'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Button, Typography } from '@mui/material'
import * as React from 'react'
import { Person, useGetPersonInfoQuery, useSetFavouriteMutation } from '../../types/graphql'
import LoadingSpinner from '../shared/general/LoadingSpinner'
import { Poster } from '../shared/general/Poster'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import styled from '@emotion/styled'


export function PersonSummary({id}: { id: Person['id'] }) {
  const {data, error, loading: loadingPerson} = useGetPersonInfoQuery({variables: {id}})
  const [setFavourite, {loading: loadingFavourite}] = useSetFavouriteMutation({variables: {id, favourite: true}})

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  if (loadingPerson) {
    return <LoadingSpinner/>
  }

  const {person} = data
  return (
    <StyledWrapper>
      <Poster
        style={{height: '400px', width: '266.66px', backgroundColor: 'white', margin: '0 auto'}}
        src={person.profilePath}
        alt={`image of ${person.name}`}
      />
      <div>
        <Typography variant="h1" sx={{mt: 0}}>{person.name}</Typography>
        <Typography variant="body2" style={{ marginBottom: '20px'}}>Known for {person.knownForDepartment}</Typography>
        <Typography variant="body1">{person.biography}</Typography>
        <Button
          disabled={loadingFavourite}
          style={{marginTop: 20}}
          variant="contained"
          startIcon={person.favourited ? <FavoriteIcon style={{color: 'red'}}/> : <FavoriteBorderIcon style={{color: 'red'}}/>}
          onClick={() => setFavourite({variables: {id, favourite: !person.favourited}})}
        >
          {person.favourited ? 'Favourited' : 'Favourite'}
        </Button>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${({theme}) => theme.breakpoints.up('md')} {
    flex-direction: row;
  }
`


gql`
  query GetPersonInfo($id: ID!) {
    person(id: $id) {
      id
      profilePath
      name
      knownForDepartment
      biography
      favourited
    }
  }
`

gql`
  mutation SetFavourite($id: ID!, $favourite: Boolean!) {
    setFavourite(id: $id, favourited: $favourite) {
      id
      favourited
    }
  }
`
