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
    const publicRoute = ['/auth/login', '/auth/register', '/blog', '/blog/[slug]', '/']
    const token = tokens?.token

    if (!token) {
      if (!publicRoute.includes(pathname)) {
        router.push('/auth/login')
      }
    } else {
      router.push('/room')
    }
  }, [router, pathname, tokens, isAuthenticated])

  return <>{children}</>
}
