import { gql } from '@apollo/client'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, Tooltip, Typography } from '@mui/material'
import * as React from 'react'
import { Movie, useSetWatchedMutation } from '../../../types/graphql'
import { useMutationErrorHandler } from '../errorHandlers'

interface WatchedButtonProps {
  id: Movie['id'];
  watched: boolean;
  withLabel?: boolean;
}

export function WatchedButton({id, watched, withLabel}: WatchedButtonProps) {
  const [setWatched, {error}] = useSetWatchedMutation()
  useMutationErrorHandler(`Could not set as ${watched ? 'unwatched' : 'watched'}`, error)

  function handleClick() {
    return setWatched({
      variables: {id, watched: !watched},
      refetchQueries: ['GetPersonCredits', 'GetWatchedMovies', 'GetWatchlist'],
      optimisticResponse: {
        setWatched: {
          __typename: "Movie",
          id,
          watched: !watched,
        }
      }
    })
  }

  return (
    <Tooltip
      placement="top"
      disableHoverListener={withLabel}
      disableFocusListener={withLabel}
      PopperProps={{disablePortal: true}}
      title={(watched ? 'Watched' : 'Unwatched')}
    >
      <Button sx={{color: 'common.white', minWidth: 'unset'}} onClick={handleClick}>
        {watched ? <Visibility color="primary"/> : <VisibilityOff/>}
        {withLabel && <Typography variant="button" sx={{ml: 1}}>{watched ? 'Watched' : 'Unwatched'}</Typography>}
      </Button>
    </Tooltip>
  )
}

gql`
  mutation SetWatched($id: ID!, $watched: Boolean!) {
    setWatched(id: $id, watched: $watched) {
      id
      watched
    }
  }
`
