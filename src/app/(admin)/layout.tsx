import {AppSidebar} from '@/core/components/admin/sidebar/app-sidebar'
import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import {SidebarProvider} from '@src/core/components/ui/sidebar'
import {Toaster} from '@src/core/components/ui/sonner'
import React, {Suspense} from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingPage />}>
          <AppSidebar />
          {children}
          <Toaster />
        </Suspense>
      </ErrorBoundary>
    </SidebarProvider>
  )
}
