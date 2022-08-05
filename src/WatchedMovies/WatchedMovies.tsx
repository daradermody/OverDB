import {gql} from "@apollo/client";
import {LoadingButton} from "@mui/lab";
import {Typography} from "@mui/material";
import React from 'react'
import {useGetWatchedMoviesQuery} from "../../server/generated/graphql";
import MovieCards from "../shared/cards/MovieCard";

export default function WatchedMovies() {
  const {data, loading, fetchMore} = useGetWatchedMoviesQuery({
    variables: {offset: 0, limit: 24},
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  })
  const initialLoading = loading && !data

  return (
    <div>
      <Typography variant="h1">Watched movies</Typography>
      <MovieCards movies={data?.watched?.results} loading={loading && !data} loadingCount={24}/>
      <div style={{display: initialLoading || data.watched.endReached ? 'none' : 'flex', justifyContent: 'center', marginTop: 20}}>
        <LoadingButton
          loading={loading}
          variant="outlined"
          onClick={() => fetchMore({variables: {offset: data?.watched?.results?.length}})}
        >
          Show More
        </LoadingButton>
      </div>
    </div>
  )
}

gql`
  query GetWatchedMovies($offset: Int, $limit: Int) {
    watched(offset: $offset, limit: $limit) {
      endReached
      results {
        id
        title
        posterPath
        releaseDate
        watched
        inWatchlist
        sentiment
      }
    }
  }
`
