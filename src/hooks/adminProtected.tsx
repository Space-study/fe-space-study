import {useUser} from '@src/app/shared/UserProvider'
import {useRouter} from 'next/router'
import {ReactNode, useEffect} from 'react'

interface AdminProviderProps {
  children: ReactNode
}

export function AdminProvider({children}: AdminProviderProps) {
  const router = useRouter()

  const {user} = useUser()

  useEffect(() => {
    const role = user?.role.name

    if (role !== 'Admin') {
      router.push('/')
    }
  }, [router, user])
  return <>{children}</>
}
