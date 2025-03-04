'use client'

import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import Footer from '@src/core/components/common/Footer'
import Header from '@src/core/components/common/Header'
import {useAuth} from '@src/hooks/useAuth'
import React, {Suspense} from 'react'

export default function CustomerLayout({children}: {children: React.ReactNode}) {
  useAuth()

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <Header />
        <main className='flex-grow overflow-auto'>{children}</main>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  )
}
