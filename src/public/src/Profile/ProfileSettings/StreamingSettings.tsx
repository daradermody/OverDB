import * as React from 'react'
import { UserSettings } from '../../../types/graphql'
import ProviderSettings, { LoadingProviderSettings } from './ProviderSettings'
import RegionSettings, { LoadingRegionSettings } from './RegionSettings'

interface StreamingSettingsProps {
  settings: UserSettings['streaming'];
  onChange(streamingSettings: UserSettings['streaming']): void;
}

export default function StreamingSettings({settings, onChange}: StreamingSettingsProps) {
  return (
    <>
      <RegionSettings
        region={settings.region}
        onChange={region => onChange({region, providers: settings.providers})}
      />
      <ProviderSettings
        region={settings.region}
        providerIds={settings.providers} onChange={providers => onChange({region: settings.region, providers})}
      />
    </>
  )
}

export function LoadingStreamingSettings() {
  return (
    <>
      <LoadingRegionSettings/>
      <LoadingProviderSettings/>
    </>
  )
}
