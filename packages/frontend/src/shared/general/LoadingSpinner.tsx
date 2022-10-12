import { CircularProgress, styled } from '@mui/material'
import * as React from 'react'

export default function LoadingSpinner() {
  return (
    <Root>
      <CircularProgress size={150} thickness={1}/>
    </Root>
  )
}

const Root = styled('div')({
  display: 'flex', justifyContent: 'center', margin: '200px 0'
})
