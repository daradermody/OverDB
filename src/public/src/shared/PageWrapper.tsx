import { Container } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function PageWrapper({children}: PropsWithChildren<{}>) {
  return (
    <Container fixed sx={{p: '0 16px'}}>
      {children}
    </Container>
  )
}
