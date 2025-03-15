'use client'

import {Button} from '@src/core/components/ui/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

const Header = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/meetings', label: 'Meetings'},
    {href: '/room', label: 'Room'},
    {href: '/example', label: 'Example Redux'},
    {href: '/blog', label: 'Blog'},
    {href: '/contact', label: 'Contact Us'},
  ]

  return (
    <header
      className={`${isHome ? 'fixed' : 'relative'} top-0 w-full bg-transparent backdrop-blur-md shadow-md z-50`}>
      <div className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-bold text-gray-900'>
          Edu Smart
        </Link>

        {/* Navigation */}
        <nav>
          <ul className='flex space-x-6'>
            {navItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className=' hover:text-red-500 transition duration-300'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className='flex items-center gap-4'>
          <Button variant='ghost' className=' hover:text-red-500'>
            Login
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
