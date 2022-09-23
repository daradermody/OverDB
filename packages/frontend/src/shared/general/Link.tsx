import { Link as MaterialLink } from '@mui/material'
import * as React from 'react'
import { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function Link({to, children}: { to: string, children: ReactNode }) {
  return (
    <MaterialLink
      underline="none"
      component={RouterLink}
      to={to}
      style={{textDecoration: 'none', color: 'inherit'}}
    >
      {children}
    </MaterialLink>
  )
}
