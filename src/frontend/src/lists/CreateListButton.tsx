import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ListType } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { useDeclarativeErrorHandler } from '../shared/errorHandlers'

export default function CreateListButton({onCreate}: { onCreate(): void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const {mutateAsync: create, isPending, error} = useMutation(trpc.createList.mutationOptions())
  useDeclarativeErrorHandler('Could not create list', error)

  function close() {
    setName('')
    setModalOpen(false)
  }

  async function handleCreate() {
    await create({name, type: ListType.Movie})
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
            disabled={isPending}
            value={name} onChange={e => setName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={close}>Cancel</Button>
          <Button variant="contained" loading={isPending} disabled={!name} onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
