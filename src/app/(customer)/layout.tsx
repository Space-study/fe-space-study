'use client'

import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import Header from '@src/core/components/common/Header'
import React, {Suspense} from 'react'

export default function CustomerLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className='flex flex-col min-h-screen'>
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <Header />
            <main className='flex-grow overflow-auto'>{children}</main>
            <footer className='bg-gray-800 text-white p-4'>Shared Footer</footer>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
