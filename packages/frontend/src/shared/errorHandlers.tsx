import { ApolloError } from '@apollo/client'
import styled from '@emotion/styled'
import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import * as React from 'react'
import { Component, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import PageWrapper from './PageWrapper'

export class ErrorBoundary extends Component<PropsWithChildren<{}>, { error?: Error }> {
  constructor(props) {
    super(props)
    this.state = {error: null}
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    if (this.state.error) {
      return <ErrorMessage error={this.state.error} onRetry={() => this.setState({error: null})}/>
    }
    return this.props.children
  }
}

export function ErrorMessage({error, onRetry}: { error: Error, onRetry(): void }) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = useCallback(async () => {
    try {
      setRetrying(true)
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }, [onRetry, setRetrying])

  return (
    <PageWrapper>
      <StyledErrorMessage role="alert">
        <Typography variant="h2" sx={{textAlign: 'center', margin: 0}}>Something went wrong!</Typography>
        <StyledCodeBlock>{error.message}</StyledCodeBlock>
        <LoadingButton loading={retrying} variant="contained" onClick={handleRetry}>Try again</LoadingButton>
      </StyledErrorMessage>
    </PageWrapper>
  )
}

const StyledErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 15px 5px;
  border: 10px dashed red;
`

const StyledCodeBlock = styled.div`
  text-align: center;
  width: 100%;
  padding: 20px;
  background-color: rgb(0, 0, 0, 0.2);
  border: 1px solid #430568;
  border-radius: 10px;
  margin: 0 0 20px;
`

export function useMutationErrorHandler(prefix: string, error: ApolloError) {
  useEffect(() => {
    if (error) {
      enqueueSnackbar(`${prefix}: ${error.message}`, {variant: 'error'})
    }
  }, [error])
}
