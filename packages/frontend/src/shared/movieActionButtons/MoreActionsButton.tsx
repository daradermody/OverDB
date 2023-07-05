import { MoreHoriz } from '@mui/icons-material'
import { Button, Menu, Typography } from '@mui/material'
import * as React from 'react'
import { Movie } from '../../../types/graphql'
import { useAddToListMenuItem } from './AddToLIstMenuItem'

export default function MoreActionsButton({id, withLabel}: {id: Movie['id'], withLabel?: boolean}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const {AddToListMenuItem, AddToListDialog} = useAddToListMenuItem(id)

  return (
    <div>
      <Button sx={{color: 'common.white', minWidth: 'unset'}} onClick={e => setAnchorEl(e.currentTarget)}>
        <MoreHoriz/>
        {withLabel && <Typography variant="button" sx={{ml: 1}}>More</Typography>}
      </Button>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <AddToListMenuItem onClick={() => setAnchorEl(null)}/>
      </Menu>

      <AddToListDialog/>
    </div>

  )
}
