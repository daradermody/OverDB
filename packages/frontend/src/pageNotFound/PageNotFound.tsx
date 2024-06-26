import { Box, Typography } from '@mui/material'
import * as React from 'react'
import PageWrapper from '../shared/PageWrapper'
import { WrongLocation } from '@mui/icons-material';
import useSetTitle from '../shared/useSetTitle';

export default function PageNotFound() {
  useSetTitle('Page not found')
  return (
    <PageWrapper>
      <Box display="flex" flexDirection="column" alignItems="center" gap="10px" mt={8}>
        <WrongLocation sx={{fontSize: '300px', maxWidth: '100%'}}/>
        <Typography variant="h1" align="center">Page not found 🤷</Typography>
      </Box>
    </PageWrapper>
  )
}
