import {useEffect, useState} from 'react'

// Define the interface for theme colors
export interface ThemeColors {
  background: string
  text: string
  primary: string
  secondary: string
}

// Define the colors for dark and light themes
export const darkColors: ThemeColors = {
  background: '#121212',
  text: '#ffffff',
  primary: '#6200ee',
  secondary: '#03dac6',
}

export const lightColors: ThemeColors = {
  background: '#ffffff',
  text: '#000000',
  primary: '#6200ee',
  secondary: '#03dac6',
}

// Type definition for themes
type Theme = 'dark' | 'light'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('dark') // Default to 'dark'

  useEffect(() => {
    // Only run in the client-side (browser)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme) {
        setTheme(savedTheme) // Set the theme from localStorage
      }
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme) // Save the new theme to localStorage
    }
  }

  const colors: ThemeColors = theme === 'dark' ? darkColors : lightColors

  return {colors, currentTheme: theme, toggleTheme}
}
