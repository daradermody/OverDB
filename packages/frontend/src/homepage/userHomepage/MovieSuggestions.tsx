import { gql } from '@apollo/client'
import { Loop } from '@mui/icons-material'
import { CircularProgress, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import { useGetRecommendedMoviesQuery } from '../../../types/graphql'
import MovieCards from '../../shared/cards/MovieCard'
import { ErrorMessage } from '../../shared/errorHandlers'

export function MovieSuggestions() {
  const {data, loading, error, refetch} = useGetRecommendedMoviesQuery({notifyOnNetworkStatusChange: true})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
        <Typography variant="h1">Recommended</Typography>
        <IconButton onClick={() => refetch()} disabled={loading} size="small">
          {loading ? <CircularProgress size={20}/> : <Loop/>}
        </IconButton>
      </div>
      {!loading && !error && !data?.recommendedMovies.length && (
        <Typography variant="body1">Favourite some people to get movie recommendations.</Typography>
      )}
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
