'use client'

import {store} from '@src/core/redux/store'
import {useAuth} from '@src/hooks/useAuth'
import React from 'react'
import {Toaster} from 'react-hot-toast'
import {Provider} from 'react-redux'
import './globals.css'
import {ThemeProvider} from './shared/ThemeProvider'

export default function RootLayout({children}: {children: React.ReactNode}) {
  useAuth()
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen'>
        <ThemeProvider
          // attribute='class'
          // defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <Provider store={store}>{children}</Provider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
