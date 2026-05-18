import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const ThemeMode = {
	Light: 'light',
	Dark: 'dark',
} as const

export type ThemeMode = typeof ThemeMode[keyof typeof ThemeMode]

interface ThemeState {
	mode: ThemeMode
	setMode: (mode: ThemeMode) => void
	toggleMode: () => void
}

export const THEME_STORAGE_KEY = 'ems-theme'

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			mode: ThemeMode.Light,
			setMode: (mode) => set({ mode, },),
			toggleMode: () => set((s) => ({
				mode: s.mode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light,
			}),),
		}),
		{
			name: THEME_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage,),
		},
	),
)
