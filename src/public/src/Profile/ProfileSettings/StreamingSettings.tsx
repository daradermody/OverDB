import type { UserSettings } from '../../../../apiTypes.ts'
import ProviderSettings, { LoadingProviderSettings } from './ProviderSettings'
import RegionSettings, { LoadingRegionSettings } from './RegionSettings'

interface StreamingSettingsProps {
  settings?: {
    region?: string;
    providers?: string[];
  };
  onChange(streamingSettings: UserSettings['streaming']): void | Promise<void>;
}

export default function StreamingSettings({settings, onChange}: StreamingSettingsProps) {
  return (
    <>
      <RegionSettings
        region={settings?.region}
        onChange={region => onChange({region, providers: settings?.providers})}
      />
      <ProviderSettings
        region={settings?.region}
        providerIds={settings?.providers} onChange={providers => onChange({region: settings!.region, providers})}
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
