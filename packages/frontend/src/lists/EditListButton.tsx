import { gql } from '@apollo/client'
import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { List, useEditListMutation } from '../../types/graphql'
import { useMutationErrorHandler } from '../shared/errorHandlers'

interface EditButtonProps {
  list?: Pick<List, 'id' | 'name'>;
  disabled: boolean;
  onEdit(): void
}

export default function EditListButton({list, disabled, onEdit}: EditButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [edit, {loading, error}] = useEditListMutation()
  useMutationErrorHandler('Could not edit list', error)

  useEffect(() => setName(list?.name || ''), [list])

  function close() {
    setName('')
    setModalOpen(false)
  }

  async function handleCreate() {
    await edit({variables: {id: list.id, name}})
    onEdit()
    close()
  }

  return (
    <>
      <Button variant="text" disabled={disabled} onClick={() => setModalOpen(true)}>Edit</Button>
      <Dialog onClose={close} open={modalOpen}>
        <DialogTitle>Edit list</DialogTitle>

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
          <LoadingButton variant="contained" loading={loading} disabled={!name || name === list?.name} onClick={handleCreate}>Save</LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

gql`
  mutation EditList($id: ID!, $name: String!) {
    editList(id: $id, name: $name) {
      id
    }
  }
`
