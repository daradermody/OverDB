import {Visibility, VisibilityOff} from '@mui/icons-material'
import {Button, Tooltip, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import type {Movie} from '../../../../apiTypes.ts'
import {queryClient, trpc} from '../../queryClient.ts'
import {useDeclarativeErrorHandler} from '../errorHandlers'

interface WatchedButtonProps {
  id: Movie['id'];
  watched: boolean;
  withLabel?: boolean;
}

export function WatchedButton({id, watched, withLabel}: WatchedButtonProps) {
  const {mutate: setWatched, error} = useMutation(trpc.setWatched.mutationOptions({onSuccess}))
  useDeclarativeErrorHandler(`Could not set as ${watched ? 'unwatched' : 'watched'}`, error)

  return (
    <Tooltip
      placement="top"
      disableHoverListener={withLabel}
      disableFocusListener={withLabel}
      PopperProps={{disablePortal: true}}
      title={(watched ? 'Watched' : 'Unwatched')}
    >
      <Button sx={{color: 'common.white', minWidth: 'unset'}} onClick={() => setWatched({movieId: id, isWatched: !watched})}>
        {watched ? <Visibility color="primary"/> : <VisibilityOff/>}
        {withLabel && <Typography variant="button" sx={{ml: 1}}>{watched ? 'Watched' : 'Unwatched'}</Typography>}
      </Button>
    </Tooltip>
  )
}

function onSuccess(_data: unknown, variables: typeof trpc['setWatched']['~types']['input']) {
  queryClient.setQueryData(
    trpc.recommendedMovies.queryKey(),
    oldMovies => oldMovies
      ?.map(movie => movie.id === variables.movieId ? {...movie, watched: variables.isWatched} : movie)
  )
}
