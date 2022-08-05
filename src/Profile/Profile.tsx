import {Divider, styled, Typography} from "@mui/material";
import React from 'react'
import {useGetWatchedMoviesQuery} from "../../server/generated/graphql";
import MovieCards from "../shared/cards/MovieCard";
import Link from "../shared/general/Link";
import useUser from "../useUser";

export default function Profile() {
  const user = useUser()
  const {data, loading} = useGetWatchedMoviesQuery({variables: {limit: 3}, fetchPolicy: 'network-only'})

  return (
    <div style={{display: 'flex', gap: 80, alignItems: 'start'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, margin: '20px 0 50px'}}>
        <img style={{width: 300, aspectRatio: '1', clipPath: 'circle()'}} src={user.profilePhoto} alt="profile photo"/>
        <Stats/>
      </div>
      <div>
        <Typography variant="h1">Recently Watched</Typography>
        <MovieCards movies={data?.watched?.results} loading={loading} loadingCount={3}/>
      </div>
    </div>
  )
}

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

const StatWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;

  &:hover {
    background-color: #ffffff10;
  }
`
