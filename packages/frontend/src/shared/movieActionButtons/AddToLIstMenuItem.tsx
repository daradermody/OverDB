import { gql } from '@apollo/client'
import { LoadingButton } from '@mui/lab'
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, MenuItem, Skeleton} from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { List, Movie, useAddToListMutation, useGetMovieListsQuery, useRemoveFromListMutation } from '../../../types/graphql'
import useUser from '../../useUser'
import { useMutationErrorHandler } from '../errorHandlers'
import Link from '../general/Link'

export function useAddToListMenuItem(id: Movie['id']) {
  const [open, setOpen] = useState(false)

  return {
    AddToListMenuItem: ({onClick}: { onClick(): void }) => <MenuItem onClick={() => { setOpen(true); onClick() }}>Add to list</MenuItem>,
    AddToListDialog: () => open && <AddToListDialog movieId={id} onClose={() => setOpen(false)}/>
  }
}

function AddToListDialog({movieId, onClose}: { movieId: Movie['id'], onClose: () => void }) {
  const {user} = useUser()
  const {data, error} = useGetMovieListsQuery({variables: {username: user.username}})
  const [addToList, {loading: addLoading, error: addError}] = useAddToListMutation({variables: {itemId: movieId}, refetchQueries: ['GetMovieLists']})
  const [removeFromList, {loading: removeLoading, error: removeError}] = useRemoveFromListMutation({variables: {itemId: movieId}, refetchQueries: ['GetMovieLists']})
  useMutationErrorHandler('Could not add item to list', addError)
  useMutationErrorHandler('Could not remove item from list', removeError)
  const [selectedListIds, setSelectedListIds] = useState<List['id'][]>([])

  const includedInLists = data?.user.lists
    .filter(list => list.items.find(item => item.id === movieId))
    .map(list => list.id) || []

  useEffect(() => {
    if (data) {
      setSelectedListIds(includedInLists)
    }
  }, [data, setSelectedListIds])

  async function handleAddToLists() {
    for (const listId of selectedListIds) {
      if (!includedInLists.includes(listId)) {
        await addToList({variables: {listId}})
      }
    }
    for (const listId of includedInLists) {
      if (!selectedListIds.includes(listId)) {
        await removeFromList({variables: {listId}})
      }
    }
    onClose()
  }

  const numChanges = includedInLists.filter(id => !selectedListIds.includes(id)).length + selectedListIds.filter(id => !includedInLists.includes(id)).length

  return (
    <Dialog fullWidth onClose={onClose} open>
      <DialogTitle>Add/remove from your lists</DialogTitle>

      <DialogContent>
        {error && <div>Could not fetch lists</div>}
        {data?.user.lists.length === 0 && <div>You have no lists to add to. Create one <Link to={`/profile/${user.username}/lists`}>here</Link></div>}
        {!data && <LoadingLists/>}
        {!!data && (
          <FormGroup>
            {data.user.lists.map(list => (
              <FormControlLabel
                key={list.id}
                control={
                <Checkbox
                  checked={selectedListIds.includes(list.id)}
                  onChange={e => {
                    setSelectedListIds(selected => {
                      return e.target.checked ? ([...selected, list.id]) : selected.filter(id => id !== list.id)
                    })
                  }}
                />}
                label={`${list.name} (${list.items.length} items)`}
              />
            ))}
          </FormGroup>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <LoadingButton variant="contained" loading={addLoading || removeLoading} disabled={!numChanges} onClick={handleAddToLists}>
          Update ({numChanges})
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

function LoadingLists() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '18px'}}>
      <div style={{display: 'flex', gap: '9px'}}>
        <Skeleton variant="rectangular" animation="wave" height={24} width={24}/>
        <Skeleton variant="rectangular" animation="wave" height={24} width={140}/>
      </div>
      <div style={{display: 'flex', gap: '9px'}}>
        <Skeleton variant="rectangular" animation="wave" height={24} width={24}/>
        <Skeleton variant="rectangular" animation="wave" height={24} width={220}/>
      </div>
      <div style={{display: 'flex', gap: '9px'}}>
        <Skeleton variant="rectangular" animation="wave" height={24} width={24}/>
        <Skeleton variant="rectangular" animation="wave" height={24} width={190}/>
      </div>
    </div>
  )
}

gql`
  query GetMovieLists($username: ID!) {
    user(username: $username) {
      lists(type: MOVIE) {
        id
        name
        type
        items {
          ... on Movie {
            id
          }
        }
      }
    }
  }
`

gql`
  mutation AddToList($listId: ID!, $itemId: ID!) {
    addToList(listId: $listId, itemId: $itemId) {
      id
    }
  }
`

gql`
  mutation RemoveFromList($listId: ID!, $itemId: ID!) {
    removeFromList(listId: $listId, itemId: $itemId) {
      id
    }
  }
`
