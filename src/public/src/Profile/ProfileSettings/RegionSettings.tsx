import { Autocomplete, Box, Skeleton, TextField, Typography } from '@mui/material'
import { getCodes, getName } from 'country-list'
import * as React from 'react'
import { useState } from 'react'

export default function RegionSettings({region, onChange}: { region: string, onChange: (region: string) => void }) {
  const [updating, setUpdating] = useState(false)

  function updateRegion(region: string) {
    setUpdating(true)
    try {
      onChange(region)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div>
      <Typography variant="h6">Region</Typography>
      <Autocomplete
        value={region}
        loading={updating}
        onChange={(_: any, newValue: string | null) => updateRegion(newValue)}
        sx={{width: 300}}
        options={getCodes()}
        disableClearable
        autoHighlight
        getOptionLabel={(option) => getName(option)}
        renderOption={(props, code) => (
          <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
            <img loading="lazy" width="20" src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`} alt={getName(code)}/>
            {getName(code)} ({code})
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={updating}
            size="small"
            inputProps={{...params.inputProps, autoComplete: 'new-password'}}
          />
        )}
      />
    </div>
  )
}

export function LoadingRegionSettings() {
  return (
    <div>
      <Skeleton variant="rectangular" animation="wave" height={24} width={80} sx={{m: '4px 0'}}/>
      <Skeleton variant="rectangular" animation="wave" height={40} width={300}/>
    </div>
  )
}
