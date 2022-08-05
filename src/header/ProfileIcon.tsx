import {AccountCircle, AlarmOn, Logout, Visibility} from "@mui/icons-material";
import {Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import React from "react";
import Link from "../shared/general/Link";
import useUser from "../useUser";

export function ProfileIcon() {
  const user = useUser()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleOpen = e => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <IconButton aria-describedby="profile-button" onClick={handleOpen}>
        <img style={{width: 50, aspectRatio: '1', clipPath: 'circle()'}} src={user.profilePhoto} alt="profile photo"/>
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

        <Link to="/profile/watched">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Visibility fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Watched movies</ListItemText>
          </MenuItem>
        </Link>

        <Link to="/profile/watchlist">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AlarmOn fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Watchlist</ListItemText>
          </MenuItem>
        </Link>

        <Divider/>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>

      </Menu>
    </div>
  )
}
