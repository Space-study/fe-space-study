'use client'
import {useUser} from '@src/app/shared/UserProvider'
import {AuthService} from '@src/core/services/auth/auth-service'
import {usePathname, useRouter} from 'next/navigation'
import {ReactNode, useEffect} from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {tokens, isAuthenticated, user, updateUser} = useUser()

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const authService = new AuthService()
          const userData = await authService.getMe()
          updateUser(userData)
        } catch (err) {
          console.log('Login to continue', err)
        }
      }

      fetchUser()
    }

    const publicRoute = [
      '/auth/login',
      '/auth/register',
      '/auth/confirm-email',
      '/auth/forgot-password/confirm',
      '/auth/forgot-password/reset',
      '/',
      '/blog',
      '/meetings',
    ]

    if (!user) {
      if (!publicRoute.includes(pathname)) {
        router.push('/auth/login')
      }
    }

    if (user) {
      if (publicRoute.includes(pathname) && pathname !== '/blog') {
        router.push('/')
      }
    }
  }, [router, pathname, tokens, isAuthenticated])

  return <>{children}</>
}
