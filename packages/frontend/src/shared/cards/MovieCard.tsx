import styled from '@emotion/styled'
import { Card, CardMedia, Tooltip, Typography } from '@mui/material'
import * as React from 'react'
import { Movie, MovieCredit } from '../../../types/graphql'
import Link from '../general/Link'
import { getPosterUrl, handlePosterError } from '../general/Poster'
import { SentimentSelect } from '../movieActionButtons/SentimentSelect'
import { WatchedButton } from '../movieActionButtons/WatchedButton'
import { WatchlistButton } from '../movieActionButtons/WatchlistButton'

export interface MovieCardProps {
  movie: {
    id: Movie['id'];
    title: Movie['title'];
    posterPath?: Movie['posterPath'];
    releaseDate?: Movie['releaseDate'];
    watched?: Movie['watched'];
    inWatchlist?: Movie['inWatchlist'];
    sentiment?: Movie['sentiment'];
    jobs?: MovieCredit['jobs'];
    character?: MovieCredit['character'];
  }
  showCharactersOnly?: boolean
  compressed?: boolean
}

export function MovieCard({movie, compressed, showCharactersOnly}: MovieCardProps) {
  return (
    <StyledCard sx={{height: compressed ? '75px' : undefined}}>
      <Link to={`/movie/${movie.id}`} sx={{display: compressed ? 'flex' : 'initial', height: '100%'}}>
        <MovieImage movie={movie} compressed={compressed}/>
        <MovieSummary movie={movie} showCharactersOnly={showCharactersOnly} compressed={compressed}/>
      </Link>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  width: 100%;
  -webkit-tap-highlight-color: transparent;
`

function MovieImage({movie, compressed}: MovieCardProps) {
  return (
    <StyledMovieImage>
      <CardMedia
        component="img"
        image={getPosterUrl(movie.posterPath)}
        onError={handlePosterError}
        alt={`${movie.title} poster`}
        style={{
          height: '100%',
          width: compressed ? 'unset' : undefined,
          aspectRatio: '185 / 278',
          objectFit: 'contain',
          backgroundColor: movie.posterPath ? 'black' : 'white',
        }}
      />
      {!compressed && ![undefined, null].includes(movie.watched ?? movie.inWatchlist ?? movie.sentiment) && (
        <StyledActions className="show-on-hover" onClick={e => e.preventDefault()}>
          <WatchedButton id={movie.id} watched={movie.watched}/>
          <WatchlistButton id={movie.id} inWatchlist={movie.inWatchlist}/>
          <SentimentSelect id={movie.id} sentiment={movie.sentiment} placement="top"/>
        </StyledActions>
      )}
    </StyledMovieImage>
  )
}

const StyledActions = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: -44px;
  width: 100%;
  padding: 4px 0;
  position: absolute;
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);

  @media (pointer: coarse) {
    visibility: visible;
  }
`

const StyledMovieImage = styled.div`
  position: relative;
  height: 100%;
  &:hover .show-on-hover {
    visibility: visible;
  }
`

function MovieSummary({movie, showCharactersOnly, compressed}: MovieCardProps) {
  let roles
  if (isCredit(movie)) {
    roles = showCharactersOnly ? movie.character : movie.jobs.join(', ')
  }
  return (
    <div style={{width: '100%', minWidth: 0, padding: compressed ? '11px 16px' : '16px'}}>
      <Tooltip placement="top" title={<Typography>{movie.title}</Typography>}>
        <Typography gutterBottom variant="body1" component="div" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {movie.title}
        </Typography>
      </Tooltip>
      <Typography gutterBottom variant="caption" component="div">
        {movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
      </Typography>
      {!compressed && roles && (
        <Tooltip placement="top" title={<Typography>{roles}</Typography>}>
          <Typography
            gutterBottom
            variant="subtitle2"
            component="div"
            style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}
          >
            {roles}
          </Typography>
        </Tooltip>
      )}
    </div>
  )
}

function isCredit(movie: { jobs?: any }): movie is MovieCredit {
  return 'jobs' in movie
}
