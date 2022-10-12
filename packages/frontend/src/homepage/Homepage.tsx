import * as React from 'react'
import useUser from '../useUser'
import { PublicHomepage } from './publicHomepage/PublicHomepage'
import { UserHomepage } from './userHomepage/UserHomepage'

export function Homepage() {
  const {user} = useUser()
  return user ? <UserHomepage/> : <PublicHomepage/>
}
