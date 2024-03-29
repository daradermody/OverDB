import { AccountCircle, AdminPanelSettings, Event, Favorite, FormatListNumbered, Logout, Visibility } from '@mui/icons-material'
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import * as React from 'react'
import Link from '../shared/general/Link'
import useUser from '../useUser'

export function ProfileIcon({disabled}: { disabled?: boolean }) {
  const {user, logout} = useUser()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleOpen = e => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <IconButton aria-describedby="profile-button" disabled={disabled} onClick={handleOpen}>
        <img
          style={{width: 50, aspectRatio: '1', clipPath: 'circle()', objectFit: 'cover'}}
          src={user.avatarUrl}
          alt="profile photo"
        />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{'aria-labelledby': 'profile-button'}}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >

        <Link to="/profile">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircle fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
        </Link>

        <Link to={`/profile/${user.username}/favourites`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Favorite fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Favourites</ListItemText>
          </MenuItem>
        </Link>

        <Link to={`/profile/${user.username}/watched`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Visibility fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Watched movies</ListItemText>
          </MenuItem>
        </Link>

        <Link to={`/profile/${user.username}/lists`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <FormatListNumbered fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Lists</ListItemText>
          </MenuItem>
        </Link>

        <Link to="/upcoming">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Event fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Upcoming movies</ListItemText>
          </MenuItem>
        </Link>

        {user.isAdmin && (
          <Link to="/admin">
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AdminPanelSettings fontSize="small"/>
              </ListItemIcon>
              <ListItemText>Admin</ListItemText>
            </MenuItem>
          </Link>
        )}

        <Divider/>
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <Logout fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>

      </Menu>
    </div>
  )
}
