import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Button, Typography } from '@mui/material'
import * as React from 'react'
import { Person, useGetPersonInfoQuery, useSetFavouriteMutation } from '../../types/graphql'
import { ErrorMessage, useMutationErrorHandler } from '../shared/errorHandlers'
import LoadingSpinner from '../shared/general/LoadingSpinner'
import { Poster } from '../shared/general/Poster'


export function PersonSummary({id}: { id: Person['id'] }) {
  const {data, error: fetchError, loading: loadingPerson, refetch} = useGetPersonInfoQuery({variables: {id}})
  const [setFavourite, {loading: loadingFavourite, error: mutationError}] = useSetFavouriteMutation({variables: {id, favourite: true}})
  useMutationErrorHandler(`Could not ${data?.person?.favourited ? 'unfavourite' : 'favourite'}`, mutationError)

  if (fetchError) {
    return <ErrorMessage error={fetchError} onRetry={refetch}/>
  }

  if (loadingPerson) {
    return <LoadingSpinner/>
  }

  const {person} = data
  return (
    <StyledWrapper>
      <Poster
        style={{height: '400px', width: '266.66px', backgroundColor: 'white'}}
        src={person.profilePath}
        alt={`image of ${person.name}`}
      />
      <div style={{width: '100%'}}>
        <Typography variant="h1" sx={{mt: 0}}>{person.name}</Typography>
        <Typography variant="body2" style={{marginBottom: '20px'}}>Known for {person.knownForDepartment}</Typography>
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
  align-items: center;
  gap: 40px;

  ${({theme}) => theme.breakpoints.up('md')} {
    flex-direction: row;
    align-items: start;
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
