import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List as MuiList, ListItem, ListItemText, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import type { ListSummary } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { useDeclarativeErrorHandler } from '../shared/errorHandlers'

export default function DeleteListsButton({lists, onDelete}: { lists?: ListSummary[], onDelete(): void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const {mutateAsync: deleteLists, isPending, error} = useMutation(trpc.deleteList.mutationOptions())
  useDeclarativeErrorHandler('Could not delete list', error)

  async function handleDelete() {
    await deleteLists({ids: lists!.map(list => list.id)})
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
                <ListItemText primary={`${list.name} (${list.size} items)`}/>
              </ListItem>
            ))}
          </MuiList>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" loading={isPending} onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
