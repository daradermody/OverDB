import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import PageWrapper from '../shared/PageWrapper'
import UserBadge from '../shared/UserBadge'
import useSetTitle from '../shared/useSetTitle';
import useUser from '../useUser'
import { FavouritePeople } from './FavouritePeople'
import { LikedMovies } from './LikedMovies'

export default function Favourites() {
  const {user} = useUser()
  const {type, username} = useParams<{ type: 'people' | 'movies', username: string }>()
  const navigate = useNavigate()
  useSetTitle(user?.username === username ? `Favourite ${type}` : `${username}'s favourite ${type}`)

  return (
    <PageWrapper>
      <Typography variant="h1">
        {user?.username === username ? 'Favourites' : <UserBadge username={username!}>{username}'s favourites</UserBadge>}
      </Typography>
      <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
        <Tabs value={type} onChange={(_, value) => navigate(`/profile/${username}/favourite/${value}`)}>
          <Tab label="People" value="people"/>
          <Tab label="Movies" value="movies"/>
        </Tabs>
      </Box>
      {type === 'people' && <FavouritePeople username={username!}/>}
      {type === 'movies' && <LikedMovies username={username!}/>}
    </PageWrapper>
  )
}
