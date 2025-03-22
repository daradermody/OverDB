import {Button, Container, styled, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import Link from '../shared/general/Link'
import useIsOnline from '../shared/useIsOnline'
import useUser from '../useUser'
import {ProfileIcon} from './ProfileIcon'
import {Search} from './Search'
import {ThingType} from '../../../apiTypes.ts'

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
        {window.location.pathname !== '/login' && (
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Search
              clearOnSelect
              onSelect={result => navigate(result.type === ThingType.Movie ? `/movie/${result.id}` : `/person/${result.id}`)}
              disabled={!isOnline}
            />
            {user ? <ProfileIcon disabled={!isOnline}/> : <Link to="/login"><Button>Login</Button></Link>}
          </div>
        )}
      </Container>
    </Root>
  )
}

const Root = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.primary,
  backgroundColor: '#430568',
  height: '70px',
}))
