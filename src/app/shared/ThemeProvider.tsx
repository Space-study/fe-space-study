'use client'

import {ThemeProvider as NextThemesProvider} from 'next-themes'
import * as React from 'react'

// Using React's useEffect to ensure this runs only on the client-side
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true) // Set mounted to true after hydration
  }, [])

  if (!mounted) {
    return <>{children}</> // Render children before client-side hydration
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
