import { Card, Skeleton } from '@mui/material'
import * as React from 'react'
import { isMovie } from '../../../types'
import Cards from './Cards'
import { MovieCard, MovieCardProps } from './MovieCard'
import { PersonCard, PersonCardProps } from './PersonCard'

interface MoviesPeopleCardsProps {
  moviesAndPeople?: (MovieCardProps['movie'] | PersonCardProps['person'])[]
  loading?: boolean
  loadingCount?: number
  cardProps?: Omit<MovieCardProps, 'movie'> & Omit<PersonCardProps, 'person'>
}

export default function MoviesPeopleCards(props: MoviesPeopleCardsProps) {
  return (
    <Cards items={props.moviesAndPeople} loading={props.loading} loadingCount={props.loadingCount}>
      {(item, {loading}) => {
        if (loading) {
          return <LoadingMovieCard/>
        } else if (isMovie(item)) {
          return <MovieCard movie={item} {...props.cardProps}/>
        } else {
          return <PersonCard person={item} {...props.cardProps}/>
        }
      }}
    </Cards>
  )
}

export function LoadingMovieCard() {
  return (
    <Card style={{width: 175}}>
      <Skeleton variant="rectangular" animation="wave" height={256}/>
      <Skeleton variant="rectangular" animation={false} height={85} style={{marginTop: 1}}/>
    </Card>
  )
}

interface MovieCardsProps extends Omit<MovieCardProps, 'movie'> {
  movies?: MovieCardProps['movie'][]
  loading?: boolean
  loadingCount?: number
}

export function MovieCards({movies, loading, loadingCount, ...rest}: MovieCardsProps) {
  return <MoviesPeopleCards moviesAndPeople={movies} loading={loading} loadingCount={loadingCount} cardProps={rest}/>
}

interface PersonCardsProps extends Omit<PersonCardProps, 'person'> {
  people?: PersonCardProps['person'][]
  loading?: boolean
  loadingCount?: number
}

export function PersonCards({people, loading, loadingCount, ...rest}: PersonCardsProps) {
  return <MoviesPeopleCards moviesAndPeople={people} loading={loading} loadingCount={loadingCount} cardProps={rest}/>
}
