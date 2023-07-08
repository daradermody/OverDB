import { gql } from '@apollo/client'
import styled from '@emotion/styled'
import { CheckCircle } from '@mui/icons-material'
import { CircularProgress, Tooltip, Typography } from '@mui/material'
import * as React from 'react'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '../../../types/graphql'
import { ErrorMessage, useMutationErrorHandler } from '../../shared/errorHandlers'
import StreamingSettings, { LoadingStreamingSettings } from './StreamingSettings'

export default function ProfileSettings() {
  const {data, loading: loadingSettings, error: settingsError, refetch: refetchSettings} = useGetUserSettingsQuery()
  const [updateSettings, {loading: updatingSettings, error: updateSettingsError}] = useUpdateUserSettingsMutation({refetchQueries: ['GetUserSettings']})
  useMutationErrorHandler('Could not update user settings', updateSettingsError)

  function handleSettingsChange(newSettings) {
    return updateSettings({
      variables: {settings: newSettings},
      optimisticResponse: { updateUserSettings: { ...data.settings, ...newSettings } }
    })
  }

  if (settingsError) {
    return <ErrorMessage error={settingsError} onRetry={refetchSettings}/>
  }

  if (loadingSettings) {
    return (
      <StyledSettings>
        <SettingsHeader saving={loadingSettings || updatingSettings}/>
        <LoadingStreamingSettings/>
      </StyledSettings>
    )
  }

  return (
    <StyledSettings>
      <SettingsHeader saving={loadingSettings || updatingSettings}/>
      <StreamingSettings settings={data.settings.streaming} onChange={streaming => handleSettingsChange({streaming})}/>
    </StyledSettings>
  )
}

function SettingsHeader({saving}: { saving: boolean }) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Typography variant="h1">Settings</Typography>
      <Tooltip title={saving ? 'Saving settings...' : 'Settings saved'}>
        {saving ? <CircularProgress size="20px" color="primary"/> : <CheckCircle color="disabled"/>}
      </Tooltip>
    </div>
  )
}

const StyledSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`


gql`
  query GetUserSettings {
    settings {
      streaming {
        region
        providers
      }
    }
  }
`

gql`
  mutation UpdateUserSettings($settings: UserSettingsInput!) {
    updateUserSettings(settings: $settings) {
      streaming {
        region
        providers
      }
    }
  }
`
