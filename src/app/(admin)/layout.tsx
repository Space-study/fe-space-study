'use client'

import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import {SidebarProvider} from '@src/core/components/ui/sidebar'
import {Toaster} from '@src/core/components/ui/sonner'
import {AuthProvider} from '@src/hooks/useAuth'
import {usePathname} from 'next/navigation'
import React, {Suspense} from 'react'
import {AdminSidebar} from '../../core/components/admin/sidebarAdmin/app-sidebar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isVideoCall = pathname?.startsWith('/chat/1')

  return (
    <AuthProvider>
      <SidebarProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            {!isVideoCall && <AdminSidebar />}
            {children}
            <Toaster />
          </Suspense>
        </ErrorBoundary>
      </SidebarProvider>
    </AuthProvider>
  )
}
