// src/lib/theme.ts

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'sbd-theme'

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  return 'system'
}

export function setStoredTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement

  const prefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches

  const shouldUseDark =
    theme === 'dark' || (theme === 'system' && prefersDark)

  root.classList.toggle('dark', shouldUseDark)
}
