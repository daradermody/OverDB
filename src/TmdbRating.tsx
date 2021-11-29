import {Movie} from "../server/types";
import {Box, CircularProgress, Tooltip, Typography} from "@material-ui/core";
import * as React from "react";

export function TmdbRating({movie}: { movie: Movie }) {
  return (
    <div
      style={{
        position: 'relative',
        display: movie.release_date > new Date().toISOString() ? 'none' : 'flex',
        top: -68,
        height: 0,
        right: 10,
        width: '100%',
        justifyContent: 'right'
      }}
    >
      <Tooltip placement="top" arrow title={<Typography>See on The Movie Database</Typography>}>
        <a
          style={{color: 'white'}}
          target="_blank"
          href={`https://www.themoviedb.org/movie/${movie.id}`}
        >
          <CircularProgressWithLabel value={movie.vote_average * 10}/>
        </a>
      </Tooltip>
    </div>
  )
}

function CircularProgressWithLabel(props: { value: number }) {
  return (
    <Box style={{position: 'relative', display: 'inline-flex'}}>
      <Box
        style={{
          backgroundColor: '#081c22',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%'
        }}
      >
        <Typography
          variant="body1"
          component="div"
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
      <CircularProgress variant="determinate" size="50px" style={{margin: '2px', color: '#21d07a'}} value={props.value}/>
    </Box>
  );
}
