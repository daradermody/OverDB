import { gql } from '@apollo/client'
import { Loop } from '@mui/icons-material'
import { CircularProgress, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import { useGetRecommendedMoviesQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import ApiErrorMessage from '../shared/ApiErrorMessage'

export function MovieSuggestions() {
  const {data, loading, error, refetch} = useGetRecommendedMoviesQuery({notifyOnNetworkStatusChange: true})

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
        <Typography variant="h1">Recommended</Typography>
        <IconButton onClick={() => refetch()} disabled={loading} size="small">
          {loading ? <CircularProgress size={20}/> : <Loop/>}
        </IconButton>
      </div>
      <MovieCards movies={data?.recommendedMovies} loading={loading} loadingCount={18}/>
    </div>
  )
}

gql`
  query GetRecommendedMovies {
    recommendedMovies {
      id
      posterPath
      title
      releaseDate
      watched
      inWatchlist
      sentiment
    }
  }
`
