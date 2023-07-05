import { gql } from '@apollo/client'
import { Clear, ThumbDown, ThumbsUpDown, ThumbUp } from '@mui/icons-material'
import { Button, IconButton, Popover, Typography } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import { Movie, Sentiment, useSetSentimentMutation, useSetWatchedMutation } from '../../../types/graphql'
import { useMutationErrorHandler } from '../errorHandlers'

interface SentimentSelectProps {
  id: Movie['id'];
  sentiment: Sentiment;
  withLabel?: boolean;
  placement?: 'right' | 'top'
}

export function SentimentSelect({id, sentiment, withLabel, placement}: SentimentSelectProps) {
  const [setSentiment, {error: sentimentError}] = useSetSentimentMutation()
  const [setWatched, {error: watchedError}] = useSetWatchedMutation()
  useMutationErrorHandler('Could not set sentiment', sentimentError)
  useMutationErrorHandler('Could not set watched status', watchedError)

  const [anchor, setAnchor] = useState(null)

  function changeSentiment(sentiment: Sentiment) {
    setAnchor(null)
    void setSentiment({
      variables: {id, sentiment},
      refetchQueries: ['GetPersonCredits', 'GetWatchedMovies', 'GetWatchlist'],
      optimisticResponse: {
        setSentiment: {
          __typename: 'Movie',
          id,
          sentiment
        }
      }
    })
    if (sentiment !== Sentiment.None) {
      void setWatched({
        variables: {id, watched: true},
        optimisticResponse: {
          setWatched: {
            __typename: 'Movie',
            id,
            watched: true,
          }
        }
      })
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
        {getIconForSentiment(sentiment, { color: sentiment !== Sentiment.None ? 'primary' : undefined })}
        {withLabel && <SentimentText sentiment={sentiment} onClear={() => changeSentiment(Sentiment.None)}/>}
      </Button>

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={placement === 'top' ? { vertical: 'bottom', horizontal: 'center', } : {vertical: 'center', horizontal: 'left'}}
        transformOrigin={placement === 'top' ? {vertical: 'bottom',horizontal: 'center',} : {vertical: 'center', horizontal: 'left'}}
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

function getIconForSentiment(sentiment: Sentiment, options: {color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' } = {}): JSX.Element {
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

gql`
  mutation SetSentiment($id: ID!, $sentiment: Sentiment!) {
    setSentiment(id: $id, sentiment: $sentiment) {
      id
      sentiment
    }
  }
`
