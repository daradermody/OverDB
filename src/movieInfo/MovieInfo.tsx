import {gql} from '@apollo/client';
import {Typography} from '@mui/material';
import React from 'react'
import {useParams} from 'react-router-dom';
import {Movie, useGetCreditsQuery, useGetMovieInfoQuery} from '../../server/generated/graphql';
import {PersonCard} from '../shared/cards/PersonCard';
import {InterestingDivider} from '../shared/general/InterestingDivider';
import Link from '../shared/general/Link';
import LoadingSpinner from '../shared/general/LoadingSpinner';
import {getPosterUrl} from '../shared/general/Poster';
import {SentimentSelect} from '../shared/movieActionButtons/SentimentSelect';
import {WatchedButton} from '../shared/movieActionButtons/WatchedButton';
import {WatchlistButton} from '../shared/movieActionButtons/WatchlistButton';
import RottenTomatoesReview from './RottenTomatoesReview';
import {TmdbRating} from './TmdbRating';

export function MovieInfo() {
  const {id} = useParams<{ id: string }>();

  return (
    <div>
      <MovieSummary id={id}/>
      <InterestingDivider/>
      <CrewList id={id}/>
    </div>
  );
}

function MovieSummary({id}: { id: Movie['id'] }) {
  const {data, loading} = useGetMovieInfoQuery({variables: {id}})

  if (loading) {
    return <LoadingSpinner/>
  }

  const {movie} = data

  return (
    <div style={{display: 'flex', margin: '20px'}}>
      <div style={{height: '400px', width: '267px', marginRight: '20px', flexShrink: 0}}>
        <img style={{height: '400px'}} src={getPosterUrl(movie.posterPath)} alt={`poster of ${movie.title}`}/>
        <TmdbRating id={movie.id} vote={movie.voteAverage} release={movie.releaseDate}/>
      </div>
      <div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
          <Typography variant="h1">{movie.title}</Typography>
          <Typography variant="subtitle1">({movie.releaseDate?.split('-')?.[0]})</Typography>
        </div>

        <Typography variant="body2" style={{marginBottom: '20px'}}>{movie.tagline}</Typography>
        <Typography variant="body1">{movie.overview}</Typography>

        <div style={{display: 'flex', marginTop: 30, gap: 60, alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', flexShrink: 0}}>
            <WatchedButton id={movie.id} watched={movie.watched} withLabel/>
            <WatchlistButton id={movie.id} inWatchlist={movie.inWatchlist} withLabel/>
            <SentimentSelect id={movie.id} sentiment={movie.sentiment} withLabel/>
          </div>
          <RottenTomatoesReview id={movie.id}/>
        </div>
      </div>
    </div>
  )
}

function CrewList({id}: { id: Movie['id'] }) {
  const {data, loading} = useGetCreditsQuery({variables: {id}})

  if (loading) {
    return <LoadingSpinner/>
  }

  const importantCrew = data.creditsForMovie
    .filter(person => person.jobs.find(job => importantJobs.includes(job)))
    .slice(0, 12)
  const unimportantCrew = data.creditsForMovie
    .filter(person => !importantCrew.includes(person))

  return (
    <div>
      <Typography variant="h1">Main Crew</Typography>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start', gap: 20}}>
        {importantCrew.map(person => <PersonCard key={person.id} person={person}/>)}
      </div>
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
    </div>
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
