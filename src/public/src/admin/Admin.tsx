import { Check, Close } from '@mui/icons-material'
import { Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import type { UserWithStats } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { ErrorMessage } from '../shared/errorHandlers'
import DataGrid from '../shared/general/DataGrid'
import Link from '../shared/general/Link'
import PageWrapper from '../shared/PageWrapper'
import useSetTitle from '../shared/useSetTitle'

export default function Admin() {
  useSetTitle('Admin')
  return (
    <PageWrapper>
      <Typography variant="h1">Users</Typography>
      <UsersTable/>
    </PageWrapper>
  )
}

function UsersTable() {
  const {data: users, isLoading, error, refetch} = useQuery(trpc.users.queryOptions())

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <DataGrid
      rowSelection={false}
      disableColumnSelector
      loading={isLoading}
      rows={users}
      getRowId={row => row.username}
      columns={columns}
    />
  )
}

const columns: GridColDef<UserWithStats>[] = [
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
      <Link to={`/profile/${params.row.username}/list/watchlist`}>{params.row.stats.watchlist}</Link>
  },
]
