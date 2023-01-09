import { gql } from '@apollo/client'
import { Clear, ThumbDown, ThumbsUpDown, ThumbUp } from '@mui/icons-material'
import { Button, ClickAwayListener, Fade, IconButton, Tooltip, Typography } from '@mui/material'
import * as React from 'react'
import { useCallback, useState } from 'react'
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

  const [showOptions, setShowOptions] = useState(false)

  function changeSentiment(sentiment: Sentiment) {
    setShowOptions(false)
    void setSentiment({
      variables: {id, sentiment},
      refetchQueries: ['GetPersonCredits', 'GetWatchedMovies', 'GetWatchlist', 'GetRecommendedMovies'],
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
    <ClickAwayListener onClickAway={() => setShowOptions(false)}>
      <Button color={sentiment === Sentiment.None ? 'inherit' : 'primary'} disableRipple size="medium" onClick={() => setShowOptions(true)}>
        <Tooltip
          placement={placement || 'right'}
          open={showOptions}
          sx={{bgcolor: 'transparent'}}
          onClose={() => setShowOptions(false)}
          onOpen={() => setShowOptions(true)}
          TransitionComponent={Fade}
          TransitionProps={{timeout: 0}}
          componentsProps={{tooltip: {sx: {marginLeft: '0 !important', padding: '4px 8px'}}}}
          disableHoverListener
          disableTouchListener
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
          <span/>
        </Tooltip>
        {getIconForSentiment(sentiment)}
        {!withLabel || <SentimentText invisible={showOptions} sentiment={sentiment} onClear={() => changeSentiment(Sentiment.None)}/>}
      </Button>
    </ClickAwayListener>
  )
}

function SentimentText(props: { invisible: boolean, sentiment: Sentiment, onClear(): void }) {
  return (
    <Typography variant="button" sx={{ml: 1, visibility: props.invisible ? 'hidden' : 'visible'}}>
      {getTextForSentiment(props.sentiment)}
    </Typography>
  )
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
