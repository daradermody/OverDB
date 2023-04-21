import { gql } from '@apollo/client'
import { Check, Close } from '@mui/icons-material'
import { Skeleton, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useGetUsersQuery, User } from '../../types/graphql'
import { ErrorMessage } from '../shared/errorHandlers'
import Link from '../shared/general/Link'
import PageWrapper from '../shared/PageWrapper'

export default function Admin() {
  return (
    <PageWrapper>
      <Typography variant="h1">Users</Typography>
      <UsersTable/>
    </PageWrapper>
  )
}

function UsersTable() {
  const {data, loading, error, refetch} = useGetUsersQuery()

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (loading) {
    return <LoadingTable/>
  }

  return (
    <DataGrid
      rowSelection={false}
      disableColumnSelector
      rows={data?.users}
      getRowId={row => row.username}
      columns={columns}
    />
  )
}

function LoadingTable() {
  return (
    <div style={{borderRadius: '4px', overflow: 'hidden'}}>
      <Skeleton variant="rectangular" height={56}/>
      <Skeleton variant="rectangular" height={200} sx={{ m: '1px 0'}}/>
      <Skeleton variant="rectangular" height={53}/>
    </div>
  )
}

const columns: GridColDef<User>[] = [
  {
    headerName: '',
    field: 'avatarUrl',
    renderCell: params => (
      <img
        style={{height: '100%', aspectRatio: '1', clipPath: 'circle()', objectFit: 'cover'}}
        src={params.value}
        alt={`${params.row.username} avatar`}
      />
    ),
    sortable: false,
    align: 'center',
    filterable: false
  },
  {
    headerName: 'Username',
    field: 'username',
    flex: 1,
    renderCell: params =>
      <Link to={`/profile/${params.row.username}`}>{params.value}</Link>
  },
  {
    headerName: 'Admin',
    field: 'isAdmin',
    renderCell: params => params.value ? <Check color="primary"/> : <Close/>
  },
  {
    headerName: 'Fav people',
    field: 'stats.favouritePeople',
    sortable: false,
    renderCell: params =>
      <Link to={`/profile/${params.row.username}/favourite/people`}>{params.row.stats.favouritePeople}</Link>
  },
  {
    headerName: 'Movies liked',
    field: 'stats.moviesLiked',
    sortable: false,
    renderCell: params =>
      <Link to={`/profile/${params.row.username}/favourite/movies`}>{params.row.stats.moviesLiked}</Link>
  },
  {
    headerName: 'Watched',
    field: 'stats.watched',
    sortable: false,
    renderCell: params =>
      <Link to={`/profile/${params.row.username}/watched`}>{params.row.stats.watched}</Link>
  },
  {
    headerName: 'Watchlist',
    field: 'stats.watchlist',
    sortable: false,
    renderCell: params =>
      <Link to={`/profile/${params.row.username}/watchlist`}>{params.row.stats.watchlist}</Link>
  },
]

gql`
  query GetUsers {
    users {
      username
      avatarUrl
      isAdmin
      stats {
        favouritePeople
        moviesLiked
        watched
        watchlist
      }
    }
  }
`
