'use client'

import {ProfileService} from '@/core/services/auth/auth'
import {useUser} from '@src/app/shared/UserProvider'
import {Avatar, AvatarFallback, AvatarImage} from '@src/core/components/ui/avatar'
import {Button} from '@src/core/components/ui/button'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {toast} from 'sonner'

const Header = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [_user, setUser] = useState<{lastName: string; photo: {path: string}} | null>(null)
  const {user, logout} = useUser()
  const profileService = useMemo(() => new ProfileService(), [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile()
        setUser(data)
      } catch (error) {
        toast.error('Failed to load profile' + error)
      }
    }
    fetchProfile()
  }, [profileService])

  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to logout?')
    if (confirm) {
      localStorage.removeItem('authToken')
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      logout()
    } else {
      return
    }
  }

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
          FocusHub
        </Link>

        {/* Navigation */}
        <nav>
          <ul className='flex space-x-6'>
            {navItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className='hover:text-red-500 transition duration-300'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info / Auth Buttons */}
        <div className='flex items-center gap-4'>
          {user ? (
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarImage src={_user?.photo?.path || '/default-avatar.png'} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.lastName || 'Guest'}</span>
                <span className='truncate text-xs'>{user?.email || 'guest@example.com'}</span>
              </div>
              <Button variant='ghost' className='hover:text-red-500' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild variant='ghost' className='hover:text-red-500'>
              <Link href='/auth/login'>Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
