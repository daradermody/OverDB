import React = require('react')
import styled from '@emotion/styled'
import { Alert, Button, TextField } from '@mui/material'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from './shared/PageWrapper'
import useUser from './useUser'

export default function Login() {
  const {user, login, logout} = useUser()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (user) {
      const redirect = queryString.parse(location.search).andWeWillGetYouTo as string
      if (redirect) {
        logout({preventRedirect: true})
      } else {
        navigate('/')
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    try {
      await login(formData.get('username') as string, formData.get('password') as string)
      const returnPath = queryString.parse(location.search).andWeWillGetYouTo as string
      navigate(returnPath || '/')
    } catch (e) {
      if (e.response?.status === 401) {
        setError('Invalid credentials')
      } else {
        throw e
      }
    }
  }

  return (
    <PageWrapper>
      <StyledForm onSubmit={handleSubmit}>
        <Alert severity="error" sx={{visibility: error ? 'visible' : 'hidden'}}>{error}</Alert>
        <TextField name="username" label="Username" variant="outlined"/>
        <TextField name="password" type="password" label="Password" variant="outlined"/>
        <Button type="submit" variant="contained">Log in</Button>
      </StyledForm>
    </PageWrapper>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 50px auto;
`
