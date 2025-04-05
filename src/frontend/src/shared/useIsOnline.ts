import { useEffect, useState } from 'react'

export default function useIsOnline() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true))
  }, [])

  return isOnline
}
