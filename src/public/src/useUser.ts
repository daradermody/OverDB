import { effect, signal } from '@preact/signals'
import * as cookie from 'cookie'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {User} from '../../services/users'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {trpc} from './queryClient.ts'

const userCookie = cookie.parse(document.cookie).user?.match(/^({.*})\.\w+$/)?.[1]
export const userSignal = signal<User | null>(JSON.parse(userCookie || 'null'))

export default function useUser({redirectIfNoAuth} = {redirectIfNoAuth: false}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {mutateAsync: doLogin} = useMutation(trpc.login.mutationOptions())
  const [user, setUser] = useState<User | null>(userSignal.value)

  useEffect(() => effect(() => setUser(userSignal.value)), [setUser])

  useEffect(() => {
    if (!user && redirectIfNoAuth) {
      navigate(`/login?andWillGetYouTo=${window.location.pathname}`)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    userSignal.value = await doLogin({username, password})
  }, [])

  return {
    user,
    login,
    logout: ({preventRedirect} = {preventRedirect: false}) => {
      queryClient.clear()
      Cookies.remove('user')
      userSignal.value = null
      if (!preventRedirect) {
        navigate('/')
      }
    }
  }
}
