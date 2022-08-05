import {gql} from "@apollo/client";
import {Loop} from "@mui/icons-material";
import {CircularProgress, IconButton, Typography} from "@mui/material";
import React from 'react'
import {useGetRecommendedMoviesQuery} from "../../server/generated/graphql";
import MovieCards from "../shared/cards/MovieCard";

export function MovieSuggestions() {
  const {data, loading, refetch} = useGetRecommendedMoviesQuery({notifyOnNetworkStatusChange: true})

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
        <Typography variant="h1">Recommended/Latest Movies</Typography>
        <IconButton onClick={() => refetch()} disabled={loading} size="small">
          {loading ? <CircularProgress size={20}/> : <Loop/>}
        </IconButton>
      </div>
      <MovieCards movies={data?.recommendedMovies} loading={loading} loadingCount={18}/>
    </div>
  );
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
`;
