import * as React from 'react'
import { PropsWithChildren } from 'react'
import { Container } from '@mui/material'

export default function PageWrapper({children}: PropsWithChildren<{}>) {
  return (
    <Container fixed sx={{p: '0 16px'}}>
      {children}
    </Container>
  )
}
