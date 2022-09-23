import { Card, CardActionArea, CardContent, CardMedia, Skeleton, Tooltip, Typography } from '@mui/material'
import { range } from 'lodash'
import * as React from 'react'
import { useState } from 'react'
import { Movie, MovieCredit } from '../../../types/graphql'
import Link from '../general/Link'
import { getPosterUrl } from '../general/Poster'
import { SentimentSelect } from '../movieActionButtons/SentimentSelect'
import { WatchedButton } from '../movieActionButtons/WatchedButton'
import { WatchlistButton } from '../movieActionButtons/WatchlistButton'
import { StyledCardListWrapper } from '../styledComponents'
import styled from '@emotion/styled'

interface MovieCardsProps {
  movies?: MovieCardProps['movie'][]
  loading?: boolean
  loadingCount?: number
}

export default function MovieCards({movies, loading, loadingCount}: MovieCardsProps) {
  if (loading) {
    return (
      <StyledCardListWrapper>
        {range(loadingCount || 18).map((_, i) => <LoadingMovieCard key={i}/>)}
      </StyledCardListWrapper>
    )
  } else {
    return (
      <StyledCardListWrapper>
        {movies.map(movie => <MovieCard key={movie.id} movie={movie}/>)}
      </StyledCardListWrapper>
    )
  }
}

interface MovieCardProps {
  movie: {
    id: Movie['id'];
    title: Movie['title'];
    posterPath?: Movie['posterPath'];
    releaseDate?: Movie['releaseDate'];
    watched: Movie['watched'];
    inWatchlist: Movie['inWatchlist'];
    sentiment: Movie['sentiment'];
    jobs?: MovieCredit['jobs'];
  }
}

function MovieCard({movie}: MovieCardProps) {
  return (
    <StyledCard>
      <MovieImage movie={movie}/>
      <CardContent style={{marginTop: -10}}>
        <MovieSummary movie={movie}/>
      </CardContent>
    </StyledCard>
  )
}

const StyledCard = styled(Card)`
  width: 100%;
  ${({theme}) => theme.breakpoints.up('sm')} {
    max-width: 200px;
  }
`

export function LoadingMovieCard() {
  return (
    <Card style={{width: 175}}>
      <Skeleton variant="rectangular" animation="wave" height={256}/>
      <Skeleton variant="rectangular" animation={false} height={85} style={{marginTop: 1}}/>
    </Card>
  )
}

function MovieImage({movie}: MovieCardProps) {
  const [showButtons, setShowButtons] = useState(false)

  return (
    <div
      style={{position: 'relative'}}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      <Link to={`/movie/${movie.id}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={getPosterUrl(movie.posterPath)}
            alt={`${movie.title} poster`}
            height="256px"
            style={{
              objectFit: 'contain',
              backgroundColor: movie.posterPath ? 'black' : 'white',
            }}
          />
        </CardActionArea>
      </Link>
      <div style={{
        display: 'flex',
        marginTop: -56,
        padding: '4px 0',
        position: 'absolute',
        visibility: showButtons ? 'visible' : 'hidden',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <WatchedButton id={movie.id} watched={movie.watched}/>
        <WatchlistButton id={movie.id} inWatchlist={movie.inWatchlist}/>
        <SentimentSelect id={movie.id} sentiment={movie.sentiment} placement="top"/>
      </div>
    </div>
  )
}

function MovieSummary({movie}: MovieCardProps) {
  return (
    <>
      <Tooltip placement="top" title={<Typography>{movie.title}</Typography>}>
        <Typography gutterBottom variant="body1" component="div" style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {movie.title}
        </Typography>
      </Tooltip>
      <Typography gutterBottom variant="caption" component="div">
        {movie.releaseDate ? movie.releaseDate.split('-')[0] : ''}
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

function isCredit(movie: { jobs?: any }): movie is MovieCredit {
  return !!(movie as MovieCredit).jobs
}
