import { gql } from '@apollo/client'
import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import { ListType, useCreateListMutation } from '../../types/graphql'
import { useMutationErrorHandler } from '../shared/errorHandlers'

export default function CreateListButton({onCreate}: { onCreate(): void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [create, {loading, error}] = useCreateListMutation()
  useMutationErrorHandler('Could not create list', error)

  function close() {
    setName('')
    setModalOpen(false)
  }

  async function handleCreate() {
    await create({variables: {name, type: ListType.Movie}})
    onCreate()
    close()
  }

  return (
    <>
      <Button variant="contained" onClick={() => setModalOpen(true)}>Create</Button>
      <Dialog onClose={close} open={modalOpen}>
        <DialogTitle>Create a list</DialogTitle>

        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <TextField
            label="List name"
            variant="outlined"
            fullWidth
            sx={{mt: 1}}
            disabled={loading}
            value={name} onChange={e => setName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={close}>Cancel</Button>
          <LoadingButton variant="contained" loading={loading} disabled={!name} onClick={handleCreate}>Create</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

gql`
  mutation CreateList($name: String!, $type: ListType!) {
    createList(name: $name, type: $type) {
      id
    }
  }
`
