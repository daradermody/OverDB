import React = require('react')
import { Alert, Button, TextField } from '@mui/material'
import styled from '@emotion/styled'
import useUser from './useUser'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Login() {
  const {user, login} = useUser()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    try {
      await login(formData.get('username') as string, formData.get('password') as string)
      navigate('/')
    } catch (e) {
      if (e.response?.status === 401) {
        setError('Invalid credentials')
      } else {
        throw e
      }
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Alert severity="error" sx={{visibility: error ? 'visible' : 'hidden'}}>{error}</Alert>
      <TextField name="username" label="Username" variant="outlined"/>
      <TextField name="password" type="password" label="Password" variant="outlined"/>
      <Button type="submit" variant="contained">Log in</Button>
    </StyledForm>
  )
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 50px auto;
`
