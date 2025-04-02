'use client'

import {ProfileService} from '@/core/services/auth/auth'
import {useUser} from '@src/app/shared/UserProvider'
import {Avatar, AvatarFallback, AvatarImage} from '@src/core/components/ui/avatar'
import {Button} from '@src/core/components/ui/button'
import {AuthService} from '@src/core/services/auth/auth-service'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'
import {toast} from 'sonner'

const Header = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [profile, setProfile] = useState<{lastName: string; photo: {path: string}} | null>(null)
  const {user, logout} = useUser()
  const profileService = useMemo(() => new ProfileService(), [])
  const authService = useMemo(() => new AuthService(), [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile()
        setProfile(data)
      } catch (error) {
        toast.error('Failed to load profile: ' + error)
      }
    }
    fetchProfile()
  }, [profileService])

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await authService.logout()
        localStorage.removeItem('authToken')
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
        logout()
        window.location.reload()
      } catch (error) {
        toast.error('Logout failed: ' + error)
      }
    }
  }

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  let closeTimeout: NodeJS.Timeout

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout) // Clear any pending close action
    setIsFeedbackOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsFeedbackOpen(false)
    }, 1000) // 1 second delay before closing
  }

  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/meetings', label: 'Meetings'},
    ...(user ? [{href: '/room', label: 'Room'}] : []),
    {href: '/blog', label: 'Blog'},
    {href: '/contact', label: 'Contact Us'},
    {
      label: 'FeedBack',
      subItems: [
        {href: '/rp-issue', label: 'Report Issue'},
        {href: '/rp-issue/mine', label: 'My Report'},
      ],
    },
    {href: '/package', label: 'Package'},
    {href: '/chat-ai', label: 'Chat AI'},
  ]

  return (
    <header
      className={`${isHome ? 'fixed' : 'relative'} top-0 w-full bg-transparent backdrop-blur-md z-50`}>
      <div className='container mx-auto flex items-center justify-between py-4 px-6'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-bold text-gray-900'>
          FocusHub
        </Link>

        {/* Navigation */}
        <nav>
          <ul className='flex space-x-6'>
            {navItems.map((item, index) => (
              <li
                key={index}
                className='relative group'
                onMouseEnter={item.label === 'FeedBack' ? handleMouseEnter : undefined}
                onMouseLeave={item.label === 'FeedBack' ? handleMouseLeave : undefined}>
                {item.subItems ? (
                  <>
                    <button className='hover:text-red-500 transition duration-300'>
                      {item.label}
                    </button>
                    <ul
                      className={`absolute bg-white text-black shadow-md mt-2 rounded-md transition-opacity duration-300 ${
                        isFeedbackOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link href={subItem.href} className='block px-4 py-2 hover:bg-gray-200'>
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className='hover:text-red-500 transition duration-300'>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info / Auth Buttons */}
        <div className='flex items-center gap-4'>
          {user ? (
            <div className='flex items-center gap-3'>
             <Link href="/user-profile" className="flex items-center gap-3">
  <Avatar>
    <AvatarImage src={profile?.photo?.path || '/default-avatar.png'} />
    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
  </Avatar>
  <div className="grid flex-1 text-left text-sm leading-tight">
    <span className="truncate font-semibold">{user?.lastName || 'Guest'}</span>
    <span className="truncate text-xs">{user?.email || 'guest@example.com'}</span>
  </div>
</Link>
<Button variant="ghost" className="hover:text-red-500" onClick={handleLogout}>
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
