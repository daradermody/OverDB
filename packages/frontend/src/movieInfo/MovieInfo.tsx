import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Movie, useGetCreditsQuery, useGetMovieInfoQuery } from '../../types/graphql'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import { PersonCard } from '../shared/cards/PersonCard'
import { InterestingDivider } from '../shared/general/InterestingDivider'
import Link from '../shared/general/Link'
import LoadingSpinner from '../shared/general/LoadingSpinner'
import { Poster } from '../shared/general/Poster'
import { SentimentSelect } from '../shared/movieActionButtons/SentimentSelect'
import { WatchedButton } from '../shared/movieActionButtons/WatchedButton'
import { WatchlistButton } from '../shared/movieActionButtons/WatchlistButton'
import PageWrapper from '../shared/PageWrapper'
import { StyledCardListWrapper } from '../shared/styledComponents'
import RottenTomatoesReview from './RottenTomatoesReview'
import { TmdbRating } from './TmdbRating'

export function MovieInfo() {
  const {id} = useParams<{ id: string }>()

  return (
    <PageWrapper>
      <MovieSummary id={id}/>
      <InterestingDivider/>
      <CrewList id={id}/>
    </PageWrapper>
  )
}

function MovieSummary({id}: { id: Movie['id'] }) {
  const {data, error, loading} = useGetMovieInfoQuery({variables: {id}})

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  if (loading) {
    return <LoadingSpinner/>
  }

  const {movie} = data

  return (
    <StyledWrapper>
      <StyledPoster>
        <Poster style={{height: '400px'}} src={movie.posterPath} alt={`poster of ${movie.title}`}/>
        <TmdbRating id={movie.id} vote={movie.voteAverage} release={movie.releaseDate}/>
      </StyledPoster>
      <div>
        <div>
          <Typography variant="h1" sx={{display: 'inline'}}>{movie.title}</Typography>
          <Typography variant="subtitle1" sx={{display: 'inline', ml: 1}}>({movie.releaseDate?.split('-')?.[0]})</Typography>
        </div>

        <Typography variant="body2" sx={{m: '10px 0 20px'}}><i>{movie.tagline}</i></Typography>
        <Typography variant="body1">{movie.overview}</Typography>

        <StyledActionsAndReview>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', flexShrink: 0}}>
            <WatchedButton id={movie.id} watched={movie.watched} withLabel/>
            <WatchlistButton id={movie.id} inWatchlist={movie.inWatchlist} withLabel/>
            <SentimentSelect id={movie.id} sentiment={movie.sentiment} withLabel/>
          </div>
          <RottenTomatoesReview id={movie.id}/>
        </StyledActionsAndReview>
      </div>
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
  margin-top: 30px;

  ${({theme}) => theme.breakpoints.up('sm')} {
    flex-direction: row;
    align-items: center;
  }
`

function CrewList({id}: { id: Movie['id'] }) {
  const {data, error, loading} = useGetCreditsQuery({variables: {id}})

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  if (loading) {
    return <LoadingSpinner/>
  }

  const importantCrew = data.creditsForMovie
    .filter(person => person.jobs.find(job => importantJobs.includes(job)))
    .slice(0, 12)
  const unimportantCrew = data.creditsForMovie
    .filter(person => !importantCrew.includes(person))

  return (
    <>
      <Typography variant="h1">Main Crew</Typography>
      <StyledCardListWrapper>
        {importantCrew.map(person => <PersonCard key={person.id} person={person}/>)}
      </StyledCardListWrapper>
      <Typography variant="h1" style={{marginTop: 20}}>Other Crew</Typography>
      <div>
        {unimportantCrew.map(person => (
          <div key={person.id}>
            <Link to={`/person/${person.id}`}>
              {person.name} - {person.jobs.join(', ')}
            </Link>
          </div>
        ))}
      </div>
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
  query GetCredits($id: ID!) {
    creditsForMovie(id: $id) {
      id
      name
      profilePath
      jobs
    }
  }
`
