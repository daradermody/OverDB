import { Link as MaterialLink, SxProps } from '@mui/material'
import * as React from 'react'
import { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function Link({to, children, sx}: { to?: string, children: ReactNode, sx?: SxProps }) {
  return (
    <MaterialLink
      underline="none"
      component={RouterLink}
      to={to}
      sx={{textDecoration: 'none', color: 'inherit', pointerEvents: to ? undefined : 'none', ...sx}}
    >
      {children}
    </MaterialLink>
  )
}
