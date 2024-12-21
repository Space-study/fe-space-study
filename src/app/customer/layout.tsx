import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import SharedLayout from '@src/app/shared/SharedLayout'
import React, {Suspense} from 'react'

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <SharedLayout>{children}</SharedLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
