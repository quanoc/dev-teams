import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('agentteam-theme', theme)
}

const saved = (localStorage.getItem('agentteam-theme') as Theme | null) ??
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

applyTheme(saved)

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: saved,
  toggle: () => set((s) => {
    const next: Theme = s.theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    return { theme: next }
  }),
  setTheme: (t) => set(() => {
    applyTheme(t)
    return { theme: t }
  }),
}))
