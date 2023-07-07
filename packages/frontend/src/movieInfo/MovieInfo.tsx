import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Box, Skeleton, Typography } from '@mui/material'
import * as React from 'react'
import { useLocation } from 'react-router'
import { useNavigate, useParams } from 'react-router-dom'
import { CastCredit, Movie, useGetCastQuery, useGetCrewQuery, useGetMovieInfoQuery } from '../../types/graphql'
import { PersonCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import { InterestingDivider } from '../shared/general/InterestingDivider'
import { Poster } from '../shared/general/Poster'
import MoreActionsButton from '../shared/movieActionButtons/MoreActionsButton'
import { SentimentSelect } from '../shared/movieActionButtons/SentimentSelect'
import { WatchedButton } from '../shared/movieActionButtons/WatchedButton'
import PageWrapper from '../shared/PageWrapper'
import ToggleFilter from '../shared/ToggleFilter'
import RottenTomatoesReview, { LoadingRottenTomatoesReview } from './RottenTomatoesReview'
import StreamingProviders from './StreamingProviders'
import { TmdbRating } from './TmdbRating'

export function MovieInfo() {
  const {id} = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const peopleType: 'Crew' | 'Cast' = location.state?.peopleType || 'Crew'

  return (
    <PageWrapper>
      <MovieSummary id={id}/>
      <InterestingDivider/>
      <Box display="flex" justifyContent="center">
        <ToggleFilter
          size="small"
          fullWidth
          sx={{maxWidth: 400}}
          exclusive
          options={['Crew', 'Cast']}
          value={peopleType}
          onChange={e => {
            if ((e.target as any).value !== null) {
              navigate(location, {state: {peopleType: (e.target as any).value}, replace: true})
            }
          }}
        />
      </Box>
      {peopleType === 'Crew' ? <CrewList id={id}/> : <CastList id={id}/>}
    </PageWrapper>
  )
}

function MovieSummary({id}: { id: Movie['id'] }) {
  const {data, error, loading, refetch} = useGetMovieInfoQuery({variables: {id}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (loading) {
    return <LoadingMovieSummary/>
  }

  const {movie} = data

  return (
    <StyledWrapper>
      <StyledPoster>
        <Poster style={{height: '400px'}} src={movie.posterPath} size="l" alt={`poster of ${movie.title}`}/>
        <TmdbRating id={movie.id} vote={movie.voteAverage} release={movie.releaseDate}/>
      </StyledPoster>
      <Box width="100%">
        <div>
          <Typography component="span" variant="h1">{movie.title}</Typography>
          {movie.releaseDate && (
            <Typography component="span" sx={{ml: 1}} variant="subtitle1">({movie.releaseDate?.split('-')?.[0]})</Typography>
          )}
        </div>

        <Typography variant="body2" sx={{m: '10px 0 20px'}}><i>{movie.tagline}</i></Typography>
        <Typography variant="body1">{movie.overview}</Typography>

        <StyledActionsAndReview>
          {((movie.watched ?? movie.inWatchlist ?? movie.sentiment) !== null) && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', flexShrink: 0}}>
              <WatchedButton id={movie.id} watched={movie.watched} withLabel/>
              <SentimentSelect id={movie.id} sentiment={movie.sentiment} withLabel/>
              <MoreActionsButton id={movie.id} withLabel/>
            </div>
          )}
          <RottenTomatoesReview id={movie.id}/>
        </StyledActionsAndReview>

        <StreamingProviders id={movie.id}/>
      </Box>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  ${({theme}) => theme.breakpoints.up('md')} {
    flex-direction: row;
    align-items: start;
  }
`

const StyledPoster = styled.div`
  height: 400px;
  width: 267px;
  flex-shrink: 0;
`

const StyledActionsAndReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px 60px;
  margin: 16px 0;

  ${({theme}) => theme.breakpoints.up('sm')} {
    flex-direction: row;
    align-items: center;
  }
`

function LoadingMovieSummary() {
  return (
    <StyledWrapper>
      <StyledPoster>
        <Skeleton variant="rectangular" height="100%"/>
      </StyledPoster>
      <Box gap="10px" width="100%">
        <Skeleton variant="rectangular" height={28} sx={{maxWidth: '200px'}}/>
        <Skeleton variant="rectangular" height={16} sx={{maxWidth: '300px', m: '16px 0 24px'}}/>
        <Skeleton variant="rectangular" height={170}/>
        <StyledActionsAndReview style={{width: '100%'}}>
          <Skeleton variant="rectangular" height={116} sx={{width: '100%', maxWidth: '190px'}}/>
          <LoadingRottenTomatoesReview/>
        </StyledActionsAndReview>
      </Box>
    </StyledWrapper>
  )
}

function CrewList({id}: { id: Movie['id'] }) {
  const {data, error, loading, refetch} = useGetCrewQuery({variables: {id}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  const importantCrew = data?.crewForMovie
    .filter(person => person.jobs.find(job => importantJobs.includes(job)))
    .slice(0, 12)
  const unimportantCrew = data?.crewForMovie
    .filter(person => !importantCrew.includes(person))

  return (
    <>
      <Typography variant="h1">Main Crew</Typography>
      <PersonCards people={importantCrew} loading={loading}/>
      {!!unimportantCrew?.length && (
        <>
          <Typography variant="h1" style={{marginTop: 20}}>Other Crew</Typography>
          <PersonCards compressed people={unimportantCrew} loading={loading} loadingCount={15}/>
        </>
      )}
    </>
  )
}

function CastList({id}: { id: Movie['id'] }) {
  const {data, error, loading, refetch} = useGetCastQuery({variables: {id}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  const importantCast = data?.castForMovie
    .filter((person: CastCredit) => person.order < 12)
  const unimportantCast = data?.castForMovie
    .filter((person: CastCredit) => person.order >= 12)

  return (
    <>
      <Typography variant="h1">Main Crew</Typography>
      <PersonCards people={importantCast} loading={loading}/>
      {!!unimportantCast?.length && (
        <>
          <Typography variant="h1" style={{marginTop: 20}}>Other Cast</Typography>
          <PersonCards compressed people={unimportantCast} loading={loading} loadingCount={15}/>
        </>
      )}
    </>
  )
}

const importantJobs = [
  'Screenplay', 'Director', 'Producer', 'Sound', 'Music', 'Cinematography', 'Editor', 'Casting',
]

gql`
  query GetMovieInfo($id: ID!) {
    movie(id: $id) {
      id
      title
      tagline
      overview
      voteAverage
      posterPath
      releaseDate
      watched
      inWatchlist
      sentiment
    }
  }
`

gql`
  query GetCrew($id: ID!) {
    crewForMovie(id: $id) {
      id
      name
      profilePath
      jobs
    }
  }
`

gql`
  query GetCast($id: ID!) {
    castForMovie(id: $id) {
      character
      id
      name
      order
      profilePath
    }
  }
`
