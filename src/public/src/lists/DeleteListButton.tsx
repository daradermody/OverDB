import { gql } from '@apollo/client'
import { Button, Dialog, List as MuiList, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText, Typography } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import { type List, useDeleteListsMutation } from '../../types/graphql'
import { useDeclarativeErrorHandler } from '../shared/errorHandlers'

export default function DeleteListsButton({lists, onDelete}: { lists?: List[], onDelete(): void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteLists, {loading, error}] = useDeleteListsMutation()
  useDeclarativeErrorHandler('Could not delete list', error)

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
                <ListItemText primary={`${list.name} (${list.items.length} items)`}/>
              </ListItem>
            ))}
          </MuiList>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" loading={loading} onClick={handleCreate}>Delete</Button>
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
