import styled from '@emotion/styled'
import { Skeleton, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type { Movie } from '../../../apiTypes.ts'
import { trpc } from '../queryClient.ts'
import { useDeclarativeErrorHandler } from '../shared/errorHandlers.tsx'
import { ProviderLogo } from '../shared/general/Poster'

export default function StreamingProviders({id}: { id: Movie['id'] }) {
  const {data: providers, isLoading, error} = useQuery(trpc.streamingProvidersShowingMovie.queryOptions({id}))
  useDeclarativeErrorHandler('Could not get streaming providers showing this film', error)

  if (isLoading) return <LoadingStreamingProviders/>
  if (error || !providers?.length) return null

  return (
    <StyledRoot>
      <Typography variant="subtitle1">Available to stream from</Typography>
      <div style={{display: 'flex', gap: '8px'}}>
        {providers.map(provider => (
          <a key={provider.id} target="_blank" href={`https://www.themoviedb.org/movie/${id}/watch?locale=IE`}>
            <ProviderLogo name={provider.name} path={provider.logo}/>
          </a>
        ))}
      </div>
    </StyledRoot>
  )
}

function LoadingStreamingProviders() {
  return (
    <StyledRoot>
      <Skeleton variant="rectangular" animation="wave" height={20} width={175} style={{margin: '4px 0'}}/>
      <div style={{display: 'flex', gap: '8px'}}>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50} sx={{borderRadius: '4px'}}/>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50} sx={{borderRadius: '4px'}}/>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50} sx={{borderRadius: '4px'}}/>
      </div>
    </StyledRoot>
  )
}

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;

  ${({theme}) => theme.breakpoints.up('sm')} {
    align-items: start;
  }
`
