import * as React from 'react'
import useUser from '../useUser'
import { UserHomepage } from './userHomepage/UserHomepage'
import { PublicHomepage } from './publicHomepage/PublicHomepage'

export function Homepage() {
  const {user} = useUser()
  return user ? <UserHomepage/> : <PublicHomepage/>
}
