import { gql } from '@apollo/client'
import { Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Movie, useGetCreditsQuery, useGetMovieInfoQuery } from '../../types/graphql'
import { PersonCard } from '../shared/cards/PersonCard'
import { InterestingDivider } from '../shared/general/InterestingDivider'
import Link from '../shared/general/Link'
import LoadingSpinner from '../shared/general/LoadingSpinner'
import { getPosterUrl } from '../shared/general/Poster'
import { SentimentSelect } from '../shared/movieActionButtons/SentimentSelect'
import { WatchedButton } from '../shared/movieActionButtons/WatchedButton'
import { WatchlistButton } from '../shared/movieActionButtons/WatchlistButton'
import RottenTomatoesReview from './RottenTomatoesReview'
import { TmdbRating } from './TmdbRating'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import styled from '@emotion/styled'
import { StyledCardListWrapper } from '../shared/styledComponents'

export function MovieInfo() {
  const {id} = useParams<{ id: string }>()

  return (
    <div>
      <MovieSummary id={id}/>
      <InterestingDivider/>
      <CrewList id={id}/>
    </div>
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
      <div style={{height: '400px', width: '267px', margin: '0 auto'}}>
        <img style={{height: '400px'}} src={getPosterUrl(movie.posterPath)} alt={`poster of ${movie.title}`}/>
        <TmdbRating id={movie.id} vote={movie.voteAverage} release={movie.releaseDate}/>
      </div>
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
  gap: 40px;

  ${({theme}) => theme.breakpoints.up('md')} {
    flex-direction: row;
  }
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
  'Screenplay',
  'Director',
  'Producer',
  'Sound',
  'Music',
  'Cinematography',
  'Editor',
  'Casting',
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