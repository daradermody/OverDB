import {Clear, ThumbDown, ThumbsUpDown, ThumbUp} from '@mui/icons-material'
import {Button, IconButton, Popover, Typography} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import {useState} from 'react'
import {type Movie, Sentiment} from '../../../../apiTypes.ts'
import {queryClient, trpc} from '../../queryClient.ts'
import {useDeclarativeErrorHandler} from '../errorHandlers'

interface SentimentSelectProps {
  id: Movie['id'];
  sentiment: Sentiment;
  withLabel?: boolean;
  placement?: 'right' | 'top'
}

export function SentimentSelect({id, sentiment, withLabel, placement}: SentimentSelectProps) {
  const {mutate: setSentiment, error: setSentimentError} = useMutation(trpc.setSentiment.mutationOptions({onSuccess: onSetSentimentSuccess}))
  const {mutate: setWatched, error: setWatchedError} = useMutation(trpc.setWatched.mutationOptions({onSuccess: onSetWatchedSuccess}))
  useDeclarativeErrorHandler('Could not set sentiment', setSentimentError)
  useDeclarativeErrorHandler('Could not set watched status', setWatchedError)

  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)

  function changeSentiment(sentiment: Sentiment) {
    setAnchor(null)
    void setSentiment({movieId: id, sentiment})
    if (sentiment !== Sentiment.None) {
      void setWatched({movieId: id, isWatched: true})
    }
  }

  return (
    <>
      <Button
        sx={{minWidth: 'unset', visibility: anchor ? 'hidden' : 'inherit'}}
        color="inherit"
        disableRipple
        onClick={e => setAnchor(e.currentTarget)}
      >
        {getIconForSentiment(sentiment, {color: sentiment !== Sentiment.None ? 'primary' : undefined})}
        {withLabel && <SentimentText sentiment={sentiment} onClear={() => changeSentiment(Sentiment.None)}/>}
      </Button>

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={placement === 'top' ? {vertical: 'bottom', horizontal: 'center',} : {vertical: 'center', horizontal: 'left'}}
        transformOrigin={placement === 'top' ? {vertical: 'bottom', horizontal: 'center',} : {vertical: 'center', horizontal: 'left'}}
      >
        <div style={{
          display: 'flex',
          flexDirection: placement === 'top' ? 'column' : 'row',
          justifyContent: 'space-evenly',
          backgroundColor: !withLabel ? 'rgba(0,0,0,0.8)' : undefined,
        }}>
          <IconButton onClick={() => changeSentiment(Sentiment.Liked)}>{getIconForSentiment(Sentiment.Liked)}</IconButton>
          <IconButton onClick={() => changeSentiment(Sentiment.Disliked)}>{getIconForSentiment(Sentiment.Disliked)}</IconButton>
          <IconButton onClick={() => changeSentiment(Sentiment.None)}><Clear/></IconButton>
        </div>
      </Popover>
    </>
  )
}

function SentimentText(props: { sentiment: Sentiment, onClear(): void }) {
  return (
    <Typography variant="button" sx={{ml: 1}}>
      {getTextForSentiment(props.sentiment)}
    </Typography>
  )
}

function getIconForSentiment(sentiment: Sentiment, options: { color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' } = {}) {
  if (sentiment === Sentiment.Liked) {
    return <ThumbUp color={options.color}/>
  } else if (sentiment === Sentiment.Disliked) {
    return <ThumbDown color={options.color}/>
  } else {
    return <ThumbsUpDown color={options.color}/>
  }
}

function getTextForSentiment(sentiment: Sentiment) {
  if (sentiment === Sentiment.Liked) {
    return 'Liked'
  } else if (sentiment === Sentiment.Disliked) {
    return 'Disliked'
  } else {
    return 'Set sentiment'
  }
}

async function onSetWatchedSuccess(_data: unknown, variables: typeof trpc['setWatched']['~types']['input']) {
  queryClient.setQueriesData(
    { queryKey: trpc.recommendedMovies.queryKey() },
    (oldMovies: Movie[]) => oldMovies?.map(movie => movie.id === variables.movieId ? {...movie, watched: variables.isWatched} : movie)
  )
  await queryClient.invalidateQueries({queryKey: trpc.getWatched.infiniteQueryKey()})
  queryClient.setQueryData(trpc.isWatched.queryKey({id: variables.movieId}), () => variables.isWatched)
}

function onSetSentimentSuccess(_data: unknown, variables: typeof trpc['setSentiment']['~types']['input']) {
  queryClient.setQueriesData(
    { queryKey: trpc.recommendedMovies.queryKey() },
    (oldMovies: Movie[]) => oldMovies?.map(movie => movie.id === variables.movieId ? {...movie, sentiment: variables.sentiment} : movie)
  )
  queryClient.setQueryData(trpc.sentiment.queryKey({id: variables.movieId}), () => variables.sentiment)
}
