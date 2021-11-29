import {Card, CardActionArea, CardContent, CardMedia, Link, Tooltip, Typography} from "@material-ui/core";
import {getPosterUrl} from "./Poster";
import * as React from "react";
import {useState} from "react";
import {Link as RouterLink} from "react-router-dom";
import {LikableMovie, Movie, MovieCreditForPerson} from "../server/types";
import {SentimentSelect, WatchedButton, WatchlistButton} from "./MovieInfo";

interface MovieCardProps {
  movie: LikableMovie | MovieCreditForPerson
}

export function MovieCard({movie}: MovieCardProps) {
  return (
    <Card style={{width: 175}}>
      <MovieImage movie={movie}/>
      <CardContent style={{marginTop: -10}}>
        <MovieSummary movie={movie}/>
      </CardContent>
    </Card>
  )
}

function MovieImage({movie}: { movie: LikableMovie }) {
  const [showButtons, setShowButtons] = useState(false)

  return (
    <div
      style={{position: 'relative'}}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <Link
        underline="none"
        component={RouterLink}
        to={`/movie/${movie.id}`}
        style={{textDecoration: 'none', color: 'white'}}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            image={getPosterUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            height="262px"
            style={{objectFit: movie.poster_path ? 'fill' : 'contain', backgroundColor: 'white'}}
          />
        </CardActionArea>
      </Link>
      <div style={{display: 'flex', marginTop: -56, padding: '4px 0', position: 'absolute', visibility: showButtons ? 'visible' : 'hidden', backgroundColor: 'rgba(0,0,0,0.8)'}}>
        <WatchedButton movieId={movie.id} initialWatched={movie.watched}/>
        <WatchlistButton movieId={movie.id} initialInWatchlist={movie.inWatchlist}/>
        <SentimentSelect movieId={movie.id} initialSentiment={movie.sentiment} placement="top"/>
      </div>
    </div>
  )
}

function MovieSummary({movie}: { movie: LikableMovie | MovieCreditForPerson }) {
  return (
    <>
      <Tooltip placement="top" title={<Typography>{movie.title}</Typography>}>
        <Typography gutterBottom variant="body1" component="div" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {movie.title}
        </Typography>
      </Tooltip>
      <Typography gutterBottom variant="caption" component="div">
        {movie.release_date ? movie.release_date.split('-')[0] : ''}
      </Typography>
      {isCredit(movie) && (
        <Tooltip placement="top" title={<Typography>{movie.jobs.join(', ')}</Typography>}>
          <Typography
            gutterBottom
            variant="subtitle2"
            component="div"
            style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
          >
            {movie.jobs.join(', ')}
          </Typography>
        </Tooltip>
      )}
    </>
  )
}

function isCredit(movie: Movie | MovieCreditForPerson): movie is MovieCreditForPerson {
  return !!(movie as MovieCreditForPerson).jobs
}
