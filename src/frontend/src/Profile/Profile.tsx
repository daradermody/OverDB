import styled from '@emotion/styled'
import { Divider, Typography } from '@mui/material'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { trpc } from '../queryClient.ts'
import { MovieCards } from '../shared/cards'
import { ErrorMessage } from '../shared/errorHandlers'
import Link from '../shared/general/Link'
import PageWrapper from '../shared/PageWrapper'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser'
import ProfileSettings from './ProfileSettings/ProfileSettings'

export default function Profile() {
  const {user} = useUser()
  const username = useParams<{ username: string }>().username!
  const {data, isLoading, error, refetch} = useQuery(trpc.user.queryOptions({username}))
  useSetTitle(username)

  if (error) return <ErrorMessage error={error} onRetry={refetch}/>
  if (isLoading) return <LoadingProfile/>

  return (
    <PageWrapper>
      <StyledProfile>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, margin: '20px 0 50px'}}>
          <img style={{width: 300, aspectRatio: '1', clipPath: 'circle()'}} src={data!.avatarUrl} alt="profile photo"/>
          <Stats/>
        </div>
        {user?.username === username ? <ProfileSettings/> : <RecentlyWatchedMovies username={username}/>}
      </StyledProfile>
    </PageWrapper>
  )
}

function LoadingProfile() {
  return null
}

const StyledProfile = styled.div`
  display: flex;
  gap: 0 80px;
  align-items: start;
  justify-content: center;
  flex-wrap: wrap;

  ${({theme}) => theme.breakpoints.up('md')} {
    flex-wrap: nowrap;
  }
`

function Stats() {
  const username = useParams<{ username: string }>().username!

  const {data, isLoading, error, refetch} = useQuery(trpc.userStats.queryOptions({username}))

  if (error) return <ErrorMessage error={error} onRetry={refetch}/>

  return (
    <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
      <Link to={`/profile/${username}/favourite/people`}>
        <Stat value={data?.favouritePeople} label="Favourite people" loading={isLoading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to={`/profile/${username}/watched`}>
        <Stat value={data?.watched} label="Movies watched" loading={isLoading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to={`/profile/${username}/favourite/movies`}>
        <Stat value={data?.moviesLiked} label="Movies liked" loading={isLoading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to={`/profile/${username}/list/watchlist`}>
        <Stat value={data?.watchlist} label="In watchlist" loading={isLoading}/>
      </Link>
    </div>
  )
}

function Stat({value, label, loading}: { value?: string | number; label: string; loading?: boolean }) {
  return (
    <StatWrapper>
      <Typography sx={{fontSize: '2rem'}}>{loading ? '...' : value}</Typography>
      <Typography variant="subtitle2" sx={{textAlign: 'center'}}>{label}</Typography>
    </StatWrapper>
  )
}

const StatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;

  &:hover {
    background-color: #ffffff10;
  }
`

function RecentlyWatchedMovies({username}: { username: string }) {
  const {user} = useUser()
  const {data, error, isLoading, refetch} = useQuery(trpc.getWatched.queryOptions({username, limit: 8}))

  if (error) return <ErrorMessage error={error} onRetry={refetch}/>

  const movies = data?.items
  return (
    <div style={{width: '100%'}}>
      <Typography variant="h1">{user?.username === username ? 'Recently Watched' : `${username}'s recently watched`}</Typography>
      <MovieCards movies={movies} loading={isLoading} loadingCount={8}/>
    </div>
  )
}
