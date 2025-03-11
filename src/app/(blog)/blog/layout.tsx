import {Sidebar} from '@/core/components/blog/sidebar'
import type React from 'react'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='flex-1 ml-[240px]'>{children}</main>
    </div>
  )
}
