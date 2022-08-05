import {gql} from "@apollo/client";
import {Container, Typography} from "@mui/material";
import React from 'react'
import {useGetWatchlistQuery} from "../../server/generated/graphql";
import MovieCards from "../shared/cards/MovieCard";

export default function Watchlist() {
  const {data, loading} = useGetWatchlistQuery({fetchPolicy: "network-only"})
  return (
    <div>
      <Typography variant="h1">Watchlist</Typography>
      <MovieCards movies={data?.watchlist} loading={loading} loadingCount={6}/>
    </div>
  )
}

gql`
  query GetWatchlist {
    watchlist {
      id
      title
      posterPath
      releaseDate
      watched
      inWatchlist
      sentiment
    }
  }
`
