import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import Header from '@src/core/components/common/Header'
import React, {Suspense} from 'react'

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        {/* The entire layout is now inside Suspense */}
        <div className='flex flex-col h-screen'>
          <Header />
          <main>{children}</main>
          <footer className='bg-gray-800 text-white p-4 mt-auto'>Shared Footer</footer>
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
