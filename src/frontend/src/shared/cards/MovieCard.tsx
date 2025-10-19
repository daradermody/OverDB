import styled from '@emotion/styled'
import {Card, CardMedia, Tooltip, Typography} from '@mui/material'
import type {Movie, MovieCredit, MovieWithUserMetadata} from '../../../../apiTypes'
import Link from '../general/Link'
import {getPosterUrl, handlePosterError} from '../general/Poster'
import MoreActionsButton from '../movieActionButtons/MoreActionsButton'
import {SentimentSelect} from '../movieActionButtons/SentimentSelect'
import {WatchedButton} from '../movieActionButtons/WatchedButton'

export interface MovieCardProps {
  movie: {
    id: Movie['id'];
    title: Movie['title'];
    posterPath?: Movie['posterPath'];
    releaseDate?: Movie['releaseDate'];
    watched?: MovieWithUserMetadata['watched'];
    inWatchlist?: MovieWithUserMetadata['inWatchlist'];
    sentiment?: MovieWithUserMetadata['sentiment'];
    jobs?: MovieCredit['jobs'];
    characters?: MovieCredit['characters'];
  };
  showCharactersOnly?: boolean;
  compressed?: boolean;
  showExactDate?: boolean;
}

export function MovieCard({movie, compressed, showCharactersOnly, showExactDate}: MovieCardProps) {
  return (
    <StyledCard sx={{height: compressed ? '75px' : undefined, display: compressed ? 'flex' : undefined}}>
      <MovieImage movie={movie} compressed={compressed}/>
      <MovieSummary movie={movie} showCharactersOnly={showCharactersOnly} compressed={compressed} showExactDate={showExactDate}/>
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
      <Link to={`/movie/${movie.id}`}>
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
      </Link>
      {!compressed && movie.watched !== undefined && movie.inWatchlist !== undefined && movie.sentiment !== undefined && (
        <StyledActions className="show-on-hover">
          <WatchedButton id={movie.id} watched={movie.watched}/>
          <SentimentSelect id={movie.id} sentiment={movie.sentiment} placement="top"/>
          <MoreActionsButton id={movie.id}/>
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

function MovieSummary({movie, showCharactersOnly, compressed, showExactDate}: MovieCardProps) {
  let roles
  if (isCredit(movie)) {
    roles = showCharactersOnly ? movie.characters?.join(', ') : movie.jobs?.join(', ')
  }
  return (
    <Link to={`/movie/${movie.id}`} sx={{display: 'block', width: '100%', minWidth: 0, padding: compressed ? '11px 16px' : '16px'}}>
      <Tooltip placement="top" title={<Typography>{movie.title}</Typography>}>
        <Typography gutterBottom variant="body1" component="div" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {movie.title}
        </Typography>
      </Tooltip>
      <Typography gutterBottom variant="caption" component="div">
        {getReleaseDate(movie, showExactDate)}
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
    </Link>
  )
}

function getReleaseDate(movie: { releaseDate?: string }, showExactDate?: boolean) {
  if (!movie.releaseDate) {
    return 'TBD'
  }
  return showExactDate ? movie.releaseDate : movie.releaseDate.split('-')[0]

}

function isCredit(movie: { jobs?: any }): movie is MovieCredit {
  return 'jobs' in movie
}
