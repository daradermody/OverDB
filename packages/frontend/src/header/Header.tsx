import { Button, Container, styled, Typography } from '@mui/material'
import { isMovieSummary } from '@overdb/backend/types'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '../shared/general/Link'
import useIsOnline from '../shared/useIsOnline'
import useUser from '../useUser'
import { ProfileIcon } from './ProfileIcon'
import { Search } from './Search'

export function Header() {
  const navigate = useNavigate()
  const {user} = useUser()
  const isOnline = useIsOnline()

  return (
    <Root>
      <Container sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Link to="/">
          <Typography sx={{fontSize: 32}}>OverDB</Typography>
        </Link>
        {!!user && (
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Search
              clearOnSelect
              onSelect={result => navigate(isMovieSummary(result) ? `/movie/${result.id}` : `/person/${result.id}`)}
              disabled={!isOnline}
            />
            <ProfileIcon disabled={!isOnline}/>
          </div>
        )}
        {!user && window.location.pathname !== '/login' && (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </Container>
    </Root>
  )
}

const Root = styled('div')(({theme}) => ({
  color: theme.palette.text.primary,
  backgroundColor: '#430568',
}))
