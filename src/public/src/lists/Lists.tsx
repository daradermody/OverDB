import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { ListSummary } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { ErrorMessage } from '../shared/errorHandlers'
import DataGrid from '../shared/general/DataGrid'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle'
import useUser from '../useUser'
import CreateListButton from './CreateListButton'
import DeleteListsButton from './DeleteListButton'
import EditListButton from './EditListButton'

export default function Lists() {
  const {user} = useUser()
  const username = useParams<{ username: string }>().username!
  const {data: lists, isLoading, error, refetch} = useQuery(trpc.lists.queryOptions({username}))
  const [selected, setSelected] = useState<string[]>([])
  useSetTitle(user?.username === username ? `Your lists` : `${username}'s lists`)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  return (
    <PageWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">
          {user?.username === username ? 'Your lists' : <UserBadge username={username}>{username}'s lists</UserBadge>}
        </Typography>
        <Box display={user?.username === username ? 'flex' : 'none'} gap="10px">
          <DeleteListsButton lists={lists?.filter(list => selected.includes(list.id))} onDelete={refetch}/>
          <EditListButton disabled={selected.length !== 1} list={lists?.find(list => list.id === selected[0])} onEdit={refetch}/>
          <CreateListButton onCreate={refetch}/>
        </Box>
      </Box>
      <StyledDataGrid
        disableColumnSelector
        rows={lists}
        columns={columns}
        loading={isLoading}
        checkboxSelection={user?.username === username}
        isRowSelectable={params => params.id !== 'watchlist'}
        onRowSelectionModelChange={model => setSelected(model as string[])}
        getRowLink={params => `/profile/${username}/list/${params.rowId}`}
      />
    </PageWrapper>
  )
}

const StyledDataGrid = styled(DataGrid)`
  & [data-id="watchlist"] .MuiCheckbox-root {
    visibility: hidden;
  }
`

const columns: GridColDef<ListSummary>[] = [
  {
    headerName: 'List name',
    field: 'name',
    flex: 1,
  },
  {
    headerName: 'Size',
    field: 'size',
    renderCell: (params) => params.row.items?.length
  },
]
