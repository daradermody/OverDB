import { useApolloClient } from '@apollo/client'
import { User } from '@overdb/backend/src/services/users'
import { effect, signal } from '@preact/signals'
import axios from 'axios'
import * as cookie from 'cookie'
// @ts-ignore
import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const userCookie = cookie.parse(document.cookie).user?.match(/^s:(.*)\..*$/)?.[1]
export const userSignal = signal<User>(JSON.parse(userCookie || null))

export default function useUser({redirectIfNoAuth} = {redirectIfNoAuth: false}) {
  const navigate = useNavigate()
  const client = useApolloClient()
  const [user, setUser] = useState<User>(userSignal.value)

  useEffect(() => effect(() => setUser(userSignal.value)), [setUser])

  useEffect(() => {
    if (!user && redirectIfNoAuth) {
      navigate(`/login?andWillGetYouTo=${window.location.pathname}`)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const {data} = await axios.post(`/loginWithPassword`, {username, password})
    userSignal.value = data
  }, [])

  return {
    user,
    login,
    logout: ({preventRedirect} = {preventRedirect: false}) => {
      void client.clearStore()
      Cookies.remove('user')
      userSignal.value = null
      if (!preventRedirect) {
        navigate('/')
      }
    }
  }
}
