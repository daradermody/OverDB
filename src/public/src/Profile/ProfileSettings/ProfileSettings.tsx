import styled from '@emotion/styled'
import { CheckCircle } from '@mui/icons-material'
import { CircularProgress, Tooltip, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { UserSettings } from '../../../../apiTypes.ts'
import { queryClient, trpc } from '../../queryClient.ts'
import { ErrorMessage, useDeclarativeErrorHandler } from '../../shared/errorHandlers'
import StreamingSettings, { LoadingStreamingSettings } from './StreamingSettings'

export default function ProfileSettings() {
  const {data: settings, isLoading, error: settingsError, refetch: refetchSettings} = useQuery(trpc.userSettings.queryOptions())
  const {mutateAsync: update, isPending: isUpdating, error: updateSettingsError} = useMutation(trpc.updateUserSettings.mutationOptions({onMutate, onError}))
  useDeclarativeErrorHandler('Could not update user settings', updateSettingsError)

  if (settingsError) {
    return <ErrorMessage error={settingsError} onRetry={refetchSettings}/>
  }

  if (isLoading) {
    return (
      <StyledSettings>
        <SettingsHeader saving={isLoading || isUpdating}/>
        <LoadingStreamingSettings/>
      </StyledSettings>
    )
  }

  return (
    <StyledSettings>
      <SettingsHeader saving={isLoading || isUpdating}/>
      <StreamingSettings settings={settings!.streaming} onChange={streaming => update({streaming})}/>
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

function onMutate(settings: UserSettings) {
  queryClient.setQueryData(trpc.userSettings.queryKey(), () => settings)
}

async function onError() {
  await queryClient.invalidateQueries({ queryKey: trpc.userSettings.queryKey() })
}
