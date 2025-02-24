'use client'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect} from 'react'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const publicRoute = ['/auth/login', '/auth/register', '/blog', '/blog/[slug]', '/']

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      if (!publicRoute.includes(pathname)) {
        router.push('/auth/login')
      }
    } else {
      router.push('/room')
    }
  }, [router, pathname])
}
