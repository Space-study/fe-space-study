'use client'
import MainBanner from '@src/core/components/common/MainBanner'
import {useEffect, useState} from 'react'
const mockCustomers = [
  {name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890'},
  {name: 'Jane Smith', email: 'jane.smith@example.com', phone: '987-654-3210'},
  {name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '456-789-1234'},
]
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