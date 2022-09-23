import {gql} from "@apollo/client";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Button, Tooltip} from "@mui/material";
import * as React from "react";
import {Movie, useSetWatchedMutation} from "../../../types/graphql";

interface WatchedButtonProps {
  id: Movie['id'];
  watched: boolean;
  withLabel?: boolean;
}

export function WatchedButton({id, watched, withLabel}: WatchedButtonProps) {
  const [setWatched] = useSetWatchedMutation()

  function handleClick() {
    return setWatched({
      variables: {id, watched: !watched},
      refetchQueries: ['GetWatchedMovies', 'GetWatchlist', 'GetRecommendedMovies'],
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
      title={(watched ? 'Watched' : 'Unwatched')}
    >
      <Button sx={{color: 'common.white'}} onClick={handleClick}>
        {watched ? <Visibility color="primary"/> : <VisibilityOff/>}
        {withLabel && (watched ? 'Watched' : 'Unwatched')}
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
