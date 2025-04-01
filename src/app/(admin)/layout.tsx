'use client'

import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import {AppSidebar} from '@src/core/components/admin/sideBar/app-sidebar'
import {SidebarProvider} from '@src/core/components/ui/sidebar'
import {Toaster} from '@src/core/components/ui/sonner'
import {AuthProvider} from '@src/hooks/useAuth'
import {usePathname} from 'next/navigation'
import React, {Suspense} from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isVideoCall = pathname?.startsWith('/chat/')

  return (
    <AuthProvider>
      <SidebarProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            {!isVideoCall && <AppSidebar />}
            {children}
            <Toaster />
          </Suspense>
        </ErrorBoundary>
      </SidebarProvider>
    </AuthProvider>
  )
}
