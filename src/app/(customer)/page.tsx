'use client'
import MainBanner from '@src/core/components/common/MainBanner'
import {useEffect, useState} from 'react'

export default function CustomerPage() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [])
  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <MainBanner />
    </div>
  )
}
