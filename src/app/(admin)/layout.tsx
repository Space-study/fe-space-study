import {AppSidebar} from '@/core/components/admin/sidebar/app-sidebar'
import ErrorBoundary from '@src/app/shared/ErrorBoundary'
import LoadingPage from '@src/app/shared/LoadingPage'
import {SidebarProvider} from '@src/core/components/ui/sidebar'
import {AuthProvider} from '@src/hooks/useAuth'
import React, {Suspense} from 'react'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <ErrorBoundary>
          <Suspense fallback={<LoadingPage />}>
            <AppSidebar />
            {children}
          </Suspense>
        </ErrorBoundary>
      </SidebarProvider>
    </AuthProvider>
  )
}
