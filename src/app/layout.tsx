'use client'

import {store} from '@src/core/redux/store'
import React from 'react'
import {Toaster} from 'react-hot-toast'
import {Provider} from 'react-redux'
import './globals.css'
import {ThemeProvider} from './shared/ThemeProvider'
import {UserProvider} from './shared/UserProvider'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen'>
        <UserProvider>
          <ThemeProvider
            // attribute='class'
            // defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <Provider store={store}>{children}</Provider>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
