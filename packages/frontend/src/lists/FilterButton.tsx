import { FilterAlt } from '@mui/icons-material'
import { Button, FormControl, InputLabel, MenuItem, Popover, Select, Typography } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'

export default function FilterButton({filterStreamable, onFilterStreamableChange}: { filterStreamable: boolean, onFilterStreamableChange: (filterStreamable: boolean) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  return (
    <>
      <Button variant="outlined" endIcon={<FilterAlt/>} onClick={e => setAnchorEl(e.target as any)}>
        Filter
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <div style={{display: 'flex', gap: '16px', flexDirection: 'column', margin: '24px', minWidth: '300px'}}>
          <Typography variant="h6">Filters</Typography>

          <FormControl fullWidth>
            <InputLabel id="filter-streamable">Filter streamable</InputLabel>
            <Select
              id="filter-streamable"
              value={filterStreamable ? 'show-streamable' : 'show-all'}
              label="Filter streamable"
              onChange={() => onFilterStreamableChange(!filterStreamable)}
            >
              <MenuItem value="show-all">Show all</MenuItem>
              <MenuItem value="show-streamable">Show streamable</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Popover>
    </>
  )
}
