import { Divider, Typography } from '@mui/material'
import * as React from 'react'
import { useGetWatchedMoviesQuery } from '../../types/graphql'
import MovieCards from '../shared/cards/MovieCard'
import Link from '../shared/general/Link'
import useUser from '../useUser'
import ApiErrorMessage from '../shared/ApiErrorMessage'
import styled from '@emotion/styled'
import PageWrapper from '../shared/PageWrapper'

export default function Profile() {
  const {user} = useUser()
  const {data, error, loading} = useGetWatchedMoviesQuery({variables: {limit: 8}, fetchPolicy: 'network-only'})

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
  return (
    <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
      <Link to="/">
        <Stat value={32} label="Favourite people"/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to="/profile/watched">
        <Stat value={512} label="Movies watched"/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to="/profile/watchlist">
        <Stat value={22} label="In watchlist"/>
      </Link>
      <Divider orientation="vertical" flexItem/>
      <Link to="/">
        <Stat value={0} label="Lists"/>
      </Link>
    </div>
  )
}

function Stat({value, label}: { value: string | number; label: string }) {
  return (
    <StatWrapper>
      <Typography sx={{fontSize: '2rem'}}>{value}</Typography>
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
