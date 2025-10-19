import {Box, Typography} from '@mui/material'
import * as React from 'react'
import PageWrapper from '../shared/PageWrapper'
import {WrongLocation} from '@mui/icons-material'
import useSetTitle from '../shared/useSetTitle'

export default function PageNotFound() {
  useSetTitle('Page not found')
  return (
    <PageWrapper>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', marginTop: '64px'}}>
        <WrongLocation sx={{fontSize: '300px', maxWidth: '100%'}}/>
        <Typography variant="h1" align="center">Page not found 🤷</Typography>
      </Box>
    </PageWrapper>
  )
}
