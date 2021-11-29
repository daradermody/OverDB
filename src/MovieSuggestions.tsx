import React, {useCallback, useEffect, useState} from 'react'
import {CircularProgress, IconButton, Typography} from "@material-ui/core";
import {Loop} from "@material-ui/icons";
import {MovieCard} from "./MovieCard";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import {LikableMovie} from "../server/types";

export function MovieSuggestions() {
  const [movies, setMovies] = useState<LikableMovie[]>()

  const fetchMovies = useCallback(() => {
    axios.get<LikableMovie[]>(`/api/recommendation/movies`)
      .then(({data}) => setMovies(data));
  }, [setMovies])

  useEffect(() => void fetchMovies(), [fetchMovies])

  function handleClick() {
    setMovies(undefined)
    fetchMovies()
  }

  return (
    <div>
      <div style={{display: 'flex', margin: '20px 0'}}>
        <Typography variant="h4">Recommended/Latest Movies</Typography>
        <IconButton onClick={handleClick} disabled={!movies}>
          {movies ? <Loop/> : <CircularProgress size={20}/>}
        </IconButton>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center'}}>
        {movies ? movies.map(movie => <MovieCard key={movie.id} movie={movie}/>) : <LoadingSpinner/>}
      </div>
    </div>
  );
}
