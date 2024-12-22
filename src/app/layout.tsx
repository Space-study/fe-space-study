'use client'

import {store} from '@src/core/redux/store'
import localFont from 'next/font/local'
import React from 'react'
import {Provider} from 'react-redux'
import './globals.css'
import {ThemeProvider} from './shared/ThemeProvider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

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
