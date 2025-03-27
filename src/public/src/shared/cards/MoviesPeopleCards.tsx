import {Card, Skeleton} from '@mui/material'
import {ThingType} from '../../../../apiTypes.ts'
import Cards from './Cards'
import {MovieCard, type MovieCardProps} from './MovieCard'
import {PersonCard, type PersonCardProps} from './PersonCard'

interface MoviesPeopleCardsProps {
  moviesAndPeople?: (
    (MovieCardProps['movie'] & { type: ThingType.Movie }) |
    (PersonCardProps['person'] & { type: ThingType.Person })
  )[];
  loading?: boolean
  loadingCount?: number
  cardProps?: Omit<MovieCardProps, 'movie'> & Omit<PersonCardProps, 'person'>
  compressed?: boolean
}

export default function MoviesPeopleCards(props: MoviesPeopleCardsProps) {
  return (
    <Cards items={props.moviesAndPeople} loading={props.loading} loadingCount={props.loadingCount}>
      {(item, {loading}) => {
        if (loading) {
          return <LoadingMovieCard compressed={props.compressed}/>
        } else if (item.type === ThingType.Movie) {
          return <MovieCard movie={item} compressed={props.compressed} {...props.cardProps}/>
        } else {
          return <PersonCard person={item} compressed={props.compressed} {...props.cardProps}/>
        }
      }}
    </Cards>
  )
}

function LoadingMovieCard({compressed}: {compressed?: boolean}) {
  if (compressed) {
    return (
      <Card style={{display: 'flex'}}>
        <Skeleton variant="rectangular" animation="wave" height={75} width={50}/>
        <Skeleton variant="rectangular" animation="wave" height={75} sx={{width: '100%', ml: '1px'}}/>
      </Card>
    )
  } else {
    return (
      <Card style={{width: 175}}>
        <Skeleton variant="rectangular" animation="wave" height={256}/>
        <Skeleton variant="rectangular" animation={false} height={85} style={{marginTop: 1}}/>
      </Card>
    )
  }
}

interface MovieCardsProps extends Omit<MovieCardProps, 'movie'> {
  movies?: MovieCardProps['movie'][]
  loading?: boolean
  loadingCount?: number
  compressed?: boolean
}

export function MovieCards({movies, loading, loadingCount, compressed, ...rest}: MovieCardsProps) {
  return (
    <Cards items={movies} loading={loading} loadingCount={loadingCount}>
      {(item, {loading}) => loading ? <LoadingMovieCard compressed={compressed}/> : <MovieCard movie={item} compressed={compressed} {...rest}/>}
    </Cards>
  )
}

interface PersonCardsProps extends Omit<PersonCardProps, 'person'> {
  people?: PersonCardProps['person'][]
  loading?: boolean
  loadingCount?: number
  compressed?: boolean
}

export function PersonCards({people, loading, loadingCount, compressed, ...rest}: PersonCardsProps) {
  return (
    <Cards items={people} loading={loading} loadingCount={loadingCount}>
      {(item, {loading}) => loading ? <LoadingMovieCard compressed={compressed}/> : <PersonCard person={item} compressed={compressed} {...rest}/>}
    </Cards>
  )
}
