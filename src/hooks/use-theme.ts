// src/hooks/use-theme.ts

import { useEffect, useState } from 'react'

import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type Theme,
} from '@/lib/theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    const stored = getStoredTheme()

    setThemeState(stored)
    applyTheme(stored)

    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const onChange = () => {
      if (stored === 'system') {
        applyTheme('system')
      }
    }

    media.addEventListener('change', onChange)

    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [])

  function setTheme(theme: Theme) {
    setThemeState(theme)
    setStoredTheme(theme)
  }

  return {
    theme,
    setTheme,
  }
}
