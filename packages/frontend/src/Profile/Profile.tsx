import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Divider, Typography } from '@mui/material'
import * as React from 'react'
import { useGetProfileCountsQuery, useGetWatchedMoviesQuery } from '../../types/graphql'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import MovieCards from '../shared/cards/MovieCard'
import Link from '../shared/general/Link'
import PageWrapper from '../shared/PageWrapper'
import useUser from '../useUser'

export default function Profile() {
  const {user} = useUser()
  const {data, error, loading} = useGetWatchedMoviesQuery({variables: {limit: 8}})

  if (error) {
    return <ApiErrorMessage error={error}/>
  }

  return (
    <PageWrapper>
      <StyledProfile>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, margin: '20px 0 50px'}}>
          <img style={{width: 300, aspectRatio: '1', clipPath: 'circle()'}} src={user.avatarUrl} alt="profile photo"/>
          <Stats/>
        </div>
        <div style={{width: '100%'}}>
          <Typography variant="h1">Recently Watched</Typography>
          <MovieCards movies={data?.watched?.results} loading={loading} loadingCount={3}/>
        </div>
      </StyledProfile>
    </PageWrapper>
  )
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
  const {data, loading} = useGetProfileCountsQuery()

  return (
    <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
      <Link to="/profile/favourite/people">
        <Stat value={data?.profileCounts?.favouritePeople} label="Favourite people" loading={loading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to="/profile/watched">
        <Stat value={data?.profileCounts?.watched} label="Movies watched" loading={loading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to="/profile/favourite/movies">
        <Stat value={data?.profileCounts?.moviesLiked} label="Movies liked" loading={loading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to="/profile/watchlist">
        <Stat value={data?.profileCounts?.watchlist} label="In watchlist" loading={loading}/>
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

gql`
  query GetProfileCounts {
    profileCounts {
      favouritePeople
      watched
      moviesLiked
      watchlist
    }
  }
`
