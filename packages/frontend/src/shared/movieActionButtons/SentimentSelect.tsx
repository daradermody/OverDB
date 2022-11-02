import { gql } from '@apollo/client'
import { Clear, ThumbDown, ThumbsUpDown, ThumbUp } from '@mui/icons-material'
import { Fade, IconButton, Tooltip, Typography } from '@mui/material'
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
  const isTouchscreen = !!navigator.maxTouchPoints

  const [showOptions, setShowOptions] = useState(false)

  function changeSentiment(sentiment: Sentiment) {
    setShowOptions(false)
    void setSentiment({
      variables: {id, sentiment},
      refetchQueries: ['GetWatchedMovies', 'GetWatchlist', 'GetRecommendedMovies'],
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
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Tooltip
        placement={placement || 'right'}
        open={showOptions}
        sx={{bgcolor: 'transparent'}}
        onClose={() => setShowOptions(false)}
        onOpen={() => setShowOptions(true)}
        TransitionComponent={Fade}
        TransitionProps={{timeout: 0}}
        componentsProps={{tooltip: {sx: {marginLeft: '0 !important', padding: '4px 8px'}}}}
        disableHoverListener={isTouchscreen}
        disableTouchListener={isTouchscreen}
        title={
          <div style={{
            display: 'flex',
            flexDirection: placement === 'top' ? 'column-reverse' : 'row',
            backgroundColor: !withLabel ? 'rgba(0,0,0,0.8)' : undefined,
          }}>
            <IconButton onClick={() => changeSentiment(Sentiment.Liked)}>{getIconForSentiment(Sentiment.Liked)}</IconButton>
            <IconButton onClick={() => changeSentiment(Sentiment.Disliked)}>{getIconForSentiment(Sentiment.Disliked)}</IconButton>
            <IconButton onClick={() => changeSentiment(Sentiment.None)}><Clear/></IconButton>
          </div>
        }
      >
        <IconButton color={sentiment === Sentiment.None ? undefined : 'primary'} disableRipple size="medium" onClick={() => setShowOptions(true)}>
          {getIconForSentiment(sentiment)}
        </IconButton>
      </Tooltip>
      {showOptions || !withLabel || <SentimentText sentiment={sentiment} onClear={() => changeSentiment(Sentiment.None)}/>}
    </div>
  )
}

function SentimentText(props: { sentiment: Sentiment, onClear(): void }) {
  if (props.sentiment === Sentiment.None) {
    return <Typography variant="button">{getTextForSentiment(props.sentiment)}</Typography>
  } else {
    return (
      <Tooltip
        placement="right"
        sx={{bgcolor: 'transparent', m: 0}}
        TransitionComponent={Fade}
        title={<IconButton onClick={props.onClear} size="large"><Clear/></IconButton>}
      >
        <Typography variant="button">{getTextForSentiment(props.sentiment)}</Typography>
      </Tooltip>
    )
  }
}

function getIconForSentiment(sentiment: Sentiment): JSX.Element {
  if (sentiment === Sentiment.Liked) {
    return <ThumbUp/>
  } else if (sentiment === Sentiment.Disliked) {
    return <ThumbDown/>
  } else {
    return <ThumbsUpDown/>
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
