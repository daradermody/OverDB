import { gql } from '@apollo/client'
import { AlarmAdd, AlarmOn } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import * as React from 'react'
import { Movie, useSetInWatchlistMutation } from '../../../types/graphql'

interface WatchlistButtonProps {
  id: Movie['id'];
  inWatchlist: boolean;
  withLabel?: boolean;
}

export function WatchlistButton({id, inWatchlist, withLabel}: WatchlistButtonProps) {
  const [setInWatchlist] = useSetInWatchlistMutation()

  function handleClick() {
    return setInWatchlist({
      variables: {id, inWatchlist: !inWatchlist},
      refetchQueries: ['GetWatchedMovies', 'GetWatchlist', 'GetRecommendedMovies'],
      optimisticResponse: {
        setInWatchlist: {
          __typename: 'Movie',
          id,
          inWatchlist: !inWatchlist,
        },
      },
    })
  }

  return (
    <Tooltip
      placement="top"
      disableHoverListener={withLabel}
      disableFocusListener={withLabel}
      title={(inWatchlist ? 'Added to watchlist' : 'Add to watchlist')}
    >
      <Button sx={{color: 'common.white'}} onClick={handleClick}>
        {inWatchlist ? <AlarmOn color="primary"/> : <AlarmAdd/>}
        {withLabel && (inWatchlist ? 'Added to watchlist' : 'Add to watchlist')}
      </Button>
    </Tooltip>
  )
}

gql`
  mutation SetInWatchlist($id: ID!, $inWatchlist: Boolean!) {
    setInWatchlist(id: $id, inWatchlist: $inWatchlist) {
      id
      inWatchlist
    }
  }
`
