import React from 'react'

export default function SharedLayout({children}: {children: React.ReactNode}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-10'>
        Shared Header
      </header>

      <main className='flex-grow mt-16 overflow-auto'>{children}</main>

      <footer className='bg-gray-800 text-white p-4'>Shared Footer</footer>
    </div>
  )
}
