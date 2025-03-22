import { Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup/ToggleButtonGroup'
import * as React from 'react'

interface ToggleFilterProps extends ToggleButtonGroupProps {
  options: string[]
  loading?: boolean
}

export default function ToggleFilter({options, loading, ...props}: ToggleFilterProps) {
  if (loading) {
    return (
      <div style={{gap: 1, display: 'flex', borderRadius: 4}}>
        <Skeleton variant="rectangular" height={48} width={93}/>
        <Skeleton variant="rectangular" height={48} width={93}/>
        <Skeleton variant="rectangular" height={48} width={93}/>
      </div>
    )
  } else {
    return (
      <ToggleButtonGroup {...props}>
        {options.map(option => <ToggleButton key={option} value={option}>{option}</ToggleButton>)}
      </ToggleButtonGroup>
    )
  }
}
