import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { ListSummary } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { useDeclarativeErrorHandler } from '../shared/errorHandlers'

export default function EditListButton({list, disabled, onEdit}: { list?: ListSummary, disabled: boolean, onEdit(): void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const {mutateAsync: edit, isPending, error} = useMutation(trpc.editList.mutationOptions())
  useDeclarativeErrorHandler('Could not edit list', error)

  useEffect(() => setName(list?.name || ''), [list])

  function close() {
    setName('')
    setModalOpen(false)
  }

  async function handleCreate() {
    await edit({id: list!.id, name})
    onEdit()
    close()
  }

  return (
    <>
      <Button variant="text" disabled={disabled || !list} onClick={() => setModalOpen(true)}>Edit</Button>
      <Dialog onClose={close} open={modalOpen}>
        <DialogTitle>Edit list</DialogTitle>

        <DialogContent sx={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <TextField
            label="List name"
            variant="outlined"
            fullWidth
            sx={{mt: 1}}
            disabled={isPending}
            value={name} onChange={e => setName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={close}>Cancel</Button>
          <Button variant="contained" loading={isPending} disabled={!name || name === list?.name} onClick={handleCreate}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
