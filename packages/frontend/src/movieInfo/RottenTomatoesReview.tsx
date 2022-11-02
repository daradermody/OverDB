import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Skeleton, Typography } from '@mui/material'
import * as React from 'react'
import { Movie, Tomatometer, TomatometerState, useGetRottenTomatoesScoreQuery } from '../../types/graphql'
import { ErrorMessage } from '../shared/errorHandlers'

export default function RottenTomatoesReview({id}: { id: Movie['id'] }) {
  const {data, error, loading, refetch} = useGetRottenTomatoesScoreQuery({variables: {id}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 20, width: '100%'}}>
        <Skeleton variant="rectangular" height={75} width={75}/>
        <Skeleton variant="rectangular" height={75} sx={{flexGrow: 1}}/>
      </div>
    )
  }

  if (!data.movie.tomatometer) {
    return null
  }

  const {state, score, consensus} = data.movie.tomatometer

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
      <a href={data.movie.tomatometer.link} target="_blank" style={{position: 'relative', color: 'inherit'}}>
        <img width="75px" src={TomatometerIcons[state]} alt={state}/>
        <StyledScoreText variant="h2">
          {score}%
        </StyledScoreText>
      </a>
      <Typography variant="body1" dangerouslySetInnerHTML={{__html: consensus || 'No critics consensus'}}/>
    </div>
  )
}

export const TomatometerIcons: Record<Tomatometer['state'], string> = {
  [TomatometerState.CertifiedFresh]: 'https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/certified_fresh-notext.56a89734a59.svg',
  [TomatometerState.Fresh]: 'https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-fresh.149b5e8adc3.svg',
  [TomatometerState.Rotten]: 'https://www.rottentomatoes.com/assets/pizza-pie/images/icons/tomatometer/tomatometer-rotten.f1ef4f02ce3.svg'
}

const StyledScoreText = styled(Typography)`
  text-shadow: 0 0 4px black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
`

gql`
  query GetRottenTomatoesScore($id: ID!) {
    movie(id: $id) {
      id
      tomatometer {
        score
        consensus
        link
        state
      }
    }
  }
`
