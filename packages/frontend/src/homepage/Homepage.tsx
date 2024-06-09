import * as React from 'react'
import useSetTitle from '../shared/useSetTitle';
import useUser from '../useUser'
import { PublicHomepage } from './publicHomepage/PublicHomepage'
import { UserHomepage } from './userHomepage/UserHomepage'

export function Homepage() {
  const {user} = useUser()
  useSetTitle()
  return user ? <UserHomepage/> : <PublicHomepage/>
}
