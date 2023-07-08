import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Divider, Typography } from '@mui/material'
import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserQuery, useGetUserStatsQuery } from '../../types/graphql'
import { ErrorMessage } from '../shared/errorHandlers'
import Link from '../shared/general/Link'
import PageWrapper from '../shared/PageWrapper'
import ProfileSettings from './ProfileSettings/ProfileSettings'

export default function Profile() {
  const {username} = useParams<{ username: string }>()
  const {data, loading, error, refetch} = useGetUserQuery({variables: {username}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (loading) {
    return <LoadingProfile/>
  }

  return (
    <PageWrapper>
      <StyledProfile>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, margin: '20px 0 50px'}}>
          <img style={{width: 300, aspectRatio: '1', clipPath: 'circle()'}} src={data.user.avatarUrl} alt="profile photo"/>
          <Stats/>
        </div>
        <ProfileSettings/>
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
  const {username} = useParams<{ username: string }>()

  const {data, loading, error, refetch} = useGetUserStatsQuery({variables: {username}})

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
      <Link to={`/profile/${username}/favourite/people`}>
        <Stat value={data?.user.stats.favouritePeople} label="Favourite people" loading={loading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to={`/profile/${username}/watched`}>
        <Stat value={data?.user.stats.watched} label="Movies watched" loading={loading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to={`/profile/${username}/favourite/movies`}>
        <Stat value={data?.user.stats.moviesLiked} label="Movies liked" loading={loading}/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to={`/profile/${username}/list/watchlist`}>
        <Stat value={data?.user.stats.watchlist} label="In watchlist" loading={loading}/>
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
  query GetUser($username: ID!) {
    user(username: $username) {
      avatarUrl
    }
  }
`

gql`
  query GetUserStats($username: ID!) {
    user(username: $username) {
      stats {
        favouritePeople
        watched
        moviesLiked
        watchlist
      }
    }
  }
`
