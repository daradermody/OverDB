import styled from '@emotion/styled'
import {Button, Typography} from '@mui/material'
import {enqueueSnackbar} from 'notistack'
import {type ReactNode, useCallback, useEffect, useState} from 'react'
import PageWrapper from './PageWrapper'
import type {TRPCClientErrorBase, TRPCClientErrorLike} from '@trpc/client'

export function ErrorBoundary(props: { error?: TRPCClientErrorLike<any>, children: ReactNode }) {
  const [error, setError] = useState(props.error)
  useEffect(() => setError(props.error), [props.error])
  return error ? <ErrorMessage error={error} onRetry={() => setError(undefined)}/> : props.children
}

export function ErrorMessage({error, onRetry}: { error: TRPCClientErrorBase<any>, onRetry(): Promise<any> | void }) {
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
        <Button loading={retrying} variant="contained" onClick={handleRetry}>Try again</Button>
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

export function useDeclarativeErrorHandler(prefix: string, error?: TRPCClientErrorLike<any> | null) {
  useEffect(() => {
    if (error) {
      enqueueSnackbar(`${prefix}: ${error.message}`, {variant: 'error'})
    }
  }, [error])
}
