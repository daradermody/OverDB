import styled from '@emotion/styled'
import { Box, Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router'
import { useNavigate, useParams } from 'react-router-dom'
import type { MovieCredit } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { type PersonCardProps, PersonCards } from '../shared/cards'
import { ErrorMessage, useDeclarativeErrorHandler } from '../shared/errorHandlers'
import { InterestingDivider } from '../shared/general/InterestingDivider'
import { Poster } from '../shared/general/Poster'
import MoreActionsButton from '../shared/movieActionButtons/MoreActionsButton'
import { SentimentSelect } from '../shared/movieActionButtons/SentimentSelect'
import { WatchedButton } from '../shared/movieActionButtons/WatchedButton'
import PageWrapper from '../shared/PageWrapper'
import ToggleFilter from '../shared/ToggleFilter'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser.ts'
import RottenTomatoesReview, { LoadingRottenTomatoesReview } from './RottenTomatoesReview'
import StreamingProviders from './StreamingProviders'
import { TmdbRating } from './TmdbRating'

export function MovieInfo() {
  const id = useParams<{ id: string }>().id!
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
          onChange={(_e, peopleType: 'Crew' | 'Cast') => navigate(location, {state: {peopleType}, replace: true})}
        />
      </Box>
      {peopleType === 'Crew' ? <CrewList id={id}/> : <CastList id={id}/>}
    </PageWrapper>
  )
}

function MovieSummary({id}: { id: string }) {
  const {user} = useUser()
  const {data: movieData, isLoading: loadingMovie, error: movieError, refetch: refetchMovie} = useQuery(trpc.movie.queryOptions({id}))
  const {data: isWatched, error: isWatchedError} = useQuery(trpc.isWatched.queryOptions({id}, {enabled: !!user}))
  const {data: inWatchlist, error: inWatchlistError} = useQuery(trpc.inList.queryOptions({listId: 'watchlist', itemId: id}, {enabled: !!user}))
  const {data: sentiment, error: sentimentError} = useQuery(trpc.sentiment.queryOptions({id}, {enabled: !!user}))
  useSetTitle(movieData?.title)
  useDeclarativeErrorHandler('Could not fetch user info for this movie', isWatchedError || inWatchlistError || sentimentError)

  if (movieError) return <ErrorMessage error={movieError} onRetry={refetchMovie}/>

  if (loadingMovie) return <LoadingMovieSummary/>

  const movie = movieData!
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
          {isWatched !== undefined && inWatchlist !== undefined && sentiment !== undefined && (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start', flexShrink: 0}}>
              <WatchedButton id={movie.id} watched={isWatched} withLabel/>
              <SentimentSelect id={movie.id} sentiment={sentiment} withLabel/>
              <MoreActionsButton id={movie.id} withLabel/>
            </div>
          )}
          <RottenTomatoesReview imdbId={movie.imdbId}/>
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

function CrewList({id}: { id: string }) {
  const {data, error, isLoading, refetch} = useQuery(trpc.movieCredits.queryOptions({id, type: 'Crew'}))

  if (error) return <ErrorMessage error={error} onRetry={refetch}/>

  const bigCrew = data?.slice(0, 12).map(creditToPerson)
  const smallCrew = data?.slice(12).map(creditToPerson)

  return (
    <>
      <Typography variant="h1">Main Crew</Typography>
      <PersonCards people={bigCrew} loading={isLoading}/>
      {!!smallCrew?.length && (
        <>
          <Typography variant="h1" style={{marginTop: 20}}>Other Crew</Typography>
          <PersonCards compressed people={smallCrew} loading={isLoading} loadingCount={15}/>
        </>
      )}
    </>
  )
}

function CastList({id}: { id: string }) {
  const {data, error, isLoading, refetch} = useQuery(trpc.movieCredits.queryOptions({id, type: 'Cast'}))

  if (error) return <ErrorMessage error={error} onRetry={refetch}/>

  const bigCast = data?.slice(0, 12).map(creditToPerson)
  const smallCast = data?.slice(12).map(creditToPerson)

  return (
    <>
      <Typography variant="h1">Main Crew</Typography>
      <PersonCards people={bigCast} loading={isLoading} showCharactersOnly/>
      {!!smallCast?.length && (
        <>
          <Typography variant="h1" style={{marginTop: 20}}>Other Cast</Typography>
          <PersonCards compressed people={smallCast} loading={isLoading} loadingCount={15} showCharactersOnly/>
        </>
      )}
    </>
  )
}

function creditToPerson(credit: MovieCredit): PersonCardProps['person'] {
  return {
    id: credit.person.id,
    name: credit.person.name,
    profilePath: credit.person.profilePath,
    jobs: credit.jobs,
    characters: credit.characters,
  }
}
