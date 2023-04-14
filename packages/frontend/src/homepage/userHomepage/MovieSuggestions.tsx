import { gql } from '@apollo/client'
import { Loop } from '@mui/icons-material'
import { CircularProgress, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import { useEffect } from 'react'
import { useGetRecommendedMoviesQuery, useGetTrendingMoviesLazyQuery } from '../../../types/graphql'
import { MovieCards } from '../../shared/cards'
import { ErrorMessage } from '../../shared/errorHandlers'

export function MovieSuggestions() {
  const {
    data: recData,
    loading: recLoading,
    error: recError,
    refetch: recRefetch
  } = useGetRecommendedMoviesQuery({variables: {size: 18}, notifyOnNetworkStatusChange: true})

  const [
    fetchTrending,
    {data: trendData, loading: trendLoading, error: trendError, refetch: trendRefetch}
  ] = useGetTrendingMoviesLazyQuery({variables: {size: 18}})

  useEffect(() => {
    if (!recLoading && !recData.recommendedMovies.length) {
      void fetchTrending()
    }
  }, [recLoading, recData, fetchTrending])

  if (recError || trendError) {
    return <ErrorMessage error={recError || trendError} onRetry={recError ? recRefetch : trendRefetch}/>
  }

  if (recLoading || recData.recommendedMovies.length) {
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4, marginBottom: '42px'}}>
          <Typography variant="h1">Recommended</Typography>
          <IconButton onClick={recRefetch} disabled={recLoading} size="small">
            {recLoading ? <CircularProgress size={20}/> : <Loop/>}
          </IconButton>
        </div>
        <MovieCards movies={recData?.recommendedMovies} loading={recLoading} loadingCount={18}/>
      </div>
    )
  } else {
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
          <Typography variant="h1">Recommended</Typography>
        </div>
        <Typography variant="body1" sx={{mb: 2}}>
          Favourite some people and movies to start getting movie recommendations. Here are some trending movies to get your started.
        </Typography>
        <MovieCards movies={trendData?.trending} loading={trendLoading} loadingCount={18}/>
      </div>
    )
  }
}

gql`
  query GetRecommendedMovies($size: Int!) {
    recommendedMovies(size: $size) {
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
