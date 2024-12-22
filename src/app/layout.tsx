'use client'

import {store} from '@src/core/redux/store'
import React from 'react'
import {Provider} from 'react-redux'
import './globals.css'
import {ThemeProvider} from './shared/ThemeProvider'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <Provider store={store}>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
