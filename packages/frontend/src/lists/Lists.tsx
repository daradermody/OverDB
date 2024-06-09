import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import * as React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { List as UserList, useGetListsQuery } from '../../types/graphql'
import { ErrorMessage } from '../shared/errorHandlers'
import DataGrid from '../shared/general/DataGrid'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle';
import useUser from '../useUser'
import CreateListButton from './CreateListButton'
import DeleteListsButton from './DeleteListButton'
import EditListButton from './EditListButton'

export default function Lists() {
  const {user} = useUser()
  const {username} = useParams<{ username: string }>()
  const {data, loading, error, refetch} = useGetListsQuery({variables: {username}})
  const [selected, setSelected] = useState([])
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
          <DeleteListsButton lists={data?.user.lists.filter(list => selected.includes(list.id))} onDelete={refetch}/>
          <EditListButton disabled={selected.length !== 1} list={data?.user.lists.find(list => list.id === selected[0])} onEdit={refetch}/>
          <CreateListButton onCreate={refetch}/>
        </Box>
      </Box>
      <StyledDataGrid
        disableColumnSelector
        rows={data?.user.lists}
        columns={columns}
        loading={loading}
        checkboxSelection={user?.username === username}
        isRowSelectable={params => params.id !== 'watchlist'}
        onRowSelectionModelChange={model => setSelected(model)}
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

const columns: GridColDef<UserList>[] = [
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


gql`
  query GetLists($username: ID!) {
    user(username: $username) {
      lists {
        id
        name
        items {
          ... on Movie {
            id
          }
          ... on Person {
            id
          }
        }
      }
    }
  }
`
