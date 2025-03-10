'use client'
import {useUser} from '@src/app/shared/UserProvider'
import {usePathname, useRouter} from 'next/navigation'
import {ReactNode, useEffect} from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {tokens, isAuthenticated} = useUser()

  useEffect(() => {
    const publicRoute = [
      '/auth/login',
      '/auth/register',
      '/auth/confirm-email',
      '/auth/forgot-password/confirm',
      '/auth/forgot-password/reset',
      '/',
      '/blog',
    ]
    const _token = localStorage.getItem('authToken')

    if (!_token) {
      if (!publicRoute.includes(pathname)) {
        router.push('/auth/login')
      }
    }
  }, [router, pathname, tokens, isAuthenticated])

  return <>{children}</>
}
