'use client'

import {AuthService} from '@src/core/services/auth/auth-service'
import {useRouter, useSearchParams} from 'next/navigation'
import {Suspense, useEffect, useState} from 'react'

const ConfirmEmailComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') // Kiểm tra giá trị token
  const [status, setStatus] = useState('loading')
  const authService = new AuthService()

  useEffect(() => {
    if (token) {
      verifyEmailToken(token)
    } else {
      setStatus('error') // Nếu không có token, báo lỗi
    }
  }, [token])

  const verifyEmailToken = async (hash: string) => {
    try {
      await authService.confirmEmailToken(hash)
      setStatus('success')
    } catch (error) {
      console.error('Verification failed:', error)
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return <div>Verifying your email...</div>
  }

  if (status === 'success') {
    return (
      <div>
        <h1>Email Confirmed 🎉</h1>
        <p>Your email has been successfully confirmed.</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <h1>Invalid Token</h1>
        <p>The token is invalid or has expired. Please try again.</p>
        <button onClick={() => router.push('/resend-email')}>Resend Email</button>
      </div>
    )
  }

  return null
}

const ConfirmEmail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailComponent />
    </Suspense>
  )
}

export default ConfirmEmail
