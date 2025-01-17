import Footer from '@src/core/components/common/Footer'
import Header from '@src/core/components/common/Header'
import React from 'react'

export default function SharedLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow mt-16 overflow-auto'>{children}</main>
      <Footer />
    </div>
  )
}
