'use client'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect} from 'react'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const publicRoute = [
      '/auth/login',
      '/auth/register',
      '/blog',
      '/blog/[slug]',
      '/',
      '/confirm-email',
      '/forgot-password/confirm',
      '/forgot-password/reset',
    ]
    const token = localStorage.getItem('authToken')
    if (!token) {
      if (!publicRoute.includes(pathname)) {
        router.push('/auth/login')
      }
    } else {
      router.push('/')
    }
  }, [router, pathname])
}
