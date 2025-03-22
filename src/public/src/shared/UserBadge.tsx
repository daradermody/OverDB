import styled from '@emotion/styled'
import { Skeleton } from '@mui/material'
import type { ReactNode } from 'react'
import { useGetUserQuery, User } from '../../types/graphql'
import Link from './general/Link'

export default function UserBadge({username, children}: { username: User['username'], children: ReactNode }) {
  const {data, loading} = useGetUserQuery({variables: {username}})

  if (loading) {
    return (
      <Root style={{ marginBottom: '6.67px' }}>
        <Skeleton variant="circular" animation="wave" height={60} width={60}/>
        {children}
      </Root>
    )
  }

  return (
    <Root>
      <Link to={`/profile/${username}`} sx={{display: 'flex'}}>
        <img style={{width: 60, aspectRatio: '1', clipPath: 'circle()'}} src={data?.user.avatarUrl} alt="profile photo"/>
      </Link>
      {children}
    </Root>
  )
}

const Root = styled.span`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`
