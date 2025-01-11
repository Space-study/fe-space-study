'use client'

import MainBanner from '@src/core/components/common/MainBanner'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function CustomerPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Example check: retrieve token from local storage
    const token = localStorage.getItem('accessToken')
    if (!token) {
      // If no token is found, navigate to login
      router.push('/login')
    } else {
      // If token is found, allow user to see the content
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <MainBanner />
    </div>
  )
}
