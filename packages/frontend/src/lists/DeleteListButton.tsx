import { gql } from '@apollo/client'
import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List as MuiList, ListItem, ListItemText, Typography } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import { List, useDeleteListsMutation } from '../../types/graphql'
import { useMutationErrorHandler } from '../shared/errorHandlers'

interface DeleteListsButtonProps {
  lists?: (Pick<List, 'id' | 'name'> & {items: {results: any[] }})[];
  onDelete(): void;
}

export default function DeleteListsButton({lists, onDelete}: DeleteListsButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteLists, {loading, error}] = useDeleteListsMutation()
  useMutationErrorHandler('Could not delete list', error)

  async function handleCreate() {
    await deleteLists({variables: {ids: lists.map(list => list.id)}})
    setModalOpen(false)
    onDelete()
  }

  return (
    <>
      <Button variant="text" color="error" onClick={() => setModalOpen(true)} disabled={!lists?.length}>Delete</Button>
      <Dialog onClose={() => setModalOpen(false)} open={modalOpen}>
        <DialogTitle>Delete lists</DialogTitle>

        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          <Typography variant="body1">Are you sure you want to delete the following lists?</Typography>
          <MuiList>
            {lists?.map(list => (
              <ListItem key={list.id}>
                <ListItemText primary={`${list.name} (${list.items.results.length} items)`}/>
              </ListItem>
            ))}
          </MuiList>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={() => setModalOpen(false)}>Cancel</Button>
          <LoadingButton color="error" variant="contained" loading={loading} onClick={handleCreate}>Delete</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

gql`
  mutation DeleteLists($ids: [ID!]!) {
    deleteLists(ids: $ids)
  }
`
