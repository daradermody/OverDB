import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, MenuItem, Skeleton} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useEffect, useMemo, useState} from 'react'
import { ListType, type Movie, type User } from '../../../../apiTypes.ts'
import { queryClient, trpc } from '../../queryClient.ts'
import useUser from '../../useUser'
import {useDeclarativeErrorHandler} from '../errorHandlers'
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
  const {data: lists, error} = useQuery(trpc.lists.queryOptions({username: user!.username, type: ListType.Movie}))
  const {mutate: addToList, isPending: addToListLoading, error: addToListError} = useMutation(trpc.addToList.mutationOptions({onSuccess}))
  const {mutate: removeFromList, isPending: removeFromListLoading, error: removeFromListError} = useMutation(trpc.removeFromList.mutationOptions({onSuccess}))
  useDeclarativeErrorHandler('Could not add item to list', addToListError)
  useDeclarativeErrorHandler('Could not remove item from list', removeFromListError)
  const [selectedListIds, setSelectedListIds] = useState<string[]>([])

  const includedInLists = useMemo(
    () => lists
      ?.filter(list => list.ids.includes(movieId))
      .map(list => list.id) || [],
    [lists, movieId]
  )

  useEffect(() => {
    if (lists) {
      setSelectedListIds(includedInLists)
    }
  }, [lists, setSelectedListIds, includedInLists])

  async function handleAddToLists() {
    for (const listId of selectedListIds) {
      if (!includedInLists.includes(listId)) {
        addToList({listId, itemId: movieId})
      }
    }
    for (const listId of includedInLists) {
      if (!selectedListIds.includes(listId)) {
        removeFromList({listId, itemId: movieId})
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
        {lists?.length === 0 && <div>You have no lists to add to. Create one <Link to={`/profile/${user!.username}/lists`}>here</Link></div>}
        {!lists && <LoadingLists/>}
        {!!lists && (
          <FormGroup>
            {lists.map(list => (
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
                label={`${list.name} (${list.size} items)`}
              />
            ))}
          </FormGroup>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button variant="contained" loading={addToListLoading || removeFromListLoading} disabled={!numChanges} onClick={handleAddToLists}>
          Update ({numChanges})
        </Button>
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

async function onSuccess() {
  await queryClient.invalidateQueries({queryKey: trpc.lists.queryKey()})
  await queryClient.invalidateQueries({queryKey: trpc.list.queryKey({id: 'watchlist'})})
}
