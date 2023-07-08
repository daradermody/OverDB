import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { Add, Delete } from '@mui/icons-material'
import { Autocomplete, Box, Popover, Skeleton, TextField, Typography } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import { Provider, useGetAllStreamingProvidersQuery } from '../../../types/graphql'
import { ErrorMessage } from '../../shared/errorHandlers'
import { getPosterUrl, ProviderLogo } from '../../shared/general/Poster'

interface ProviderSettingsProps {
  region: string;
  providerIds: Provider['id'][];
  onChange(providerIds: Provider['id'][]): void
}

export default function ProviderSettings({region, providerIds, onChange}: ProviderSettingsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const {data, loading, error, refetch} = useGetAllStreamingProvidersQuery({
    variables: {region},
    skip: !region
  })

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch}/>
  }

  if (loading) {
    return <LoadingProviderSettings/>
  }

  return (
    <div>
      <Typography variant="h6">Your streaming services</Typography>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
        {providerIds.map(selectedId => {
          const provider = data.streamingProviders.find(provider => provider.id === selectedId)
          if (!provider) return null
          return (
            <RemovableProviderLogo
              key={provider?.id}
              name={provider?.name}
              path={provider?.logo}
              onRemove={() => onChange(providerIds.filter(id => id !== selectedId))}
            />
          )
        })}
        <StyledAddProviderButton onClick={e => setAnchorEl(e.currentTarget)}>
          <Add/>
        </StyledAddProviderButton>
      </div>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
      >
        <Autocomplete
          onChange={(_: any, newProvider: Provider | null) => {
            onChange([...providerIds, newProvider.id])
            setAnchorEl(null)
          }}
          sx={{width: 300}}
          options={data?.streamingProviders.filter(provider => !providerIds.includes(provider.id)) as Provider[] || []}
          disableClearable
          autoHighlight
          getOptionLabel={(option) => option.name}
          renderOption={(props, provider) => (
            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
              <img loading="lazy" width="20" src={getPosterUrl(provider.logo)} alt={provider.name}/>
              {provider.name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              inputProps={{...params.inputProps, autoComplete: 'new-password'}}
            />
          )}
        />
      </Popover>
    </div>
  )
}

function RemovableProviderLogo({name, path, onRemove}: { name: string, path: string, onRemove: () => void }) {
  return (
    <RemovableProviderLogoWrapper>
      <ProviderLogo name={name} path={path}/>
      <StyledRemoveProviderButton onClick={onRemove}><Delete/></StyledRemoveProviderButton>
    </RemovableProviderLogoWrapper>
  )
}

export function LoadingProviderSettings() {
  return (
    <div>
      <Skeleton variant="rectangular" animation="wave" height={24} width={200} sx={{m: '4px 0'}}/>
      <div style={{display: 'flex', gap: '8px'}}>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50}/>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50}/>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50}/>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50}/>
        <Skeleton variant="rectangular" animation="wave" height={50} width={50}/>
      </div>
    </div>
  )
}


const RemovableProviderLogoWrapper = styled.div`
  position: relative;

  &:hover button {
    visibility: visible;
  }
`

const StyledProviderButton = styled.button`
  min-width: 0;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: none;
  cursor: pointer;
`

const StyledRemoveProviderButton = styled(StyledProviderButton)`
  background-color: #808080d1;
  color: ${({theme}) => theme.palette.background.default};
  visibility: hidden;
  position: absolute;
  top: 0;
`

const StyledAddProviderButton = styled(StyledProviderButton)`
  background-color: #b16bda24;
  border: 1px solid #b16bda59;
  color: white;
`


gql`
  query GetAllStreamingProviders($region: String!) {
    streamingProviders(region: $region) {
      id
      name
      logo
    }
  }
`
