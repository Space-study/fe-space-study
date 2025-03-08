'use client'

import {resetPasswordSchema, type ResetPasswordData} from '@/core/utils/validation/auth'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@src/core/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormMessage} from '@src/core/components/ui/form'
import {Input} from '@src/core/components/ui/input'
import {Separator} from '@src/core/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter, useSearchParams} from 'next/navigation'
import {Suspense, useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import authImg1 from '../../authImg1.webp'

function ResetPasswordComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get('token') // Get the token from the query params
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (token) {
      verifyEmailToken(token)
    } else {
      setStatus('error') // If no token, show an error
    }
  }, [token])

  const verifyEmailToken = async (hash: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/email/confirm-forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({hash}),
        },
      )

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setStatus('error')
    }
  }

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onTouched',
  })

  const handleResetPassword = async (data: ResetPasswordData) => {
    try {
      if (!token) {
        throw new Error('Token is missing.')
      }

      const response = await fetch(`http://localhost:8000/api/v1/auth/reset/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: data.password, // Include the new password
          hash: token, // Include the token in the request
        }),
      })

      if (response.ok) {
        alert('Password has been reset successfully.')
        router.push('/auth/login') // Redirect to login
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to reset password.')
      }
    } catch (error) {
      console.error('Password reset failed:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  if (status === 'loading') {
    return <div>Verifying your email...</div>
  }

  if (status === 'success') {
    return (
      <div className='flex min-h-screen'>
        <div className='flex w-full items-center justify-center lg:w-1/2'>
          <div className='mx-auto w-full max-w-sm space-y-6 px-4'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold text-gray-900 text-left'>FocusHub</h1>
            </div>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'></span>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleResetPassword)} // Add form submission
                className='space-y-4'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Password'
                          type='password'
                          className={
                            form.formState.errors.password ? 'border-red-500' : 'border-gray-300'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full bg-[#4F46E5] hover:bg-[#4338CA]'
                  disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
            <div className='text-center text-sm'>
              {'Back to sign in? '}
              <Link href='/auth/login' className='text-[#4F46E5] hover:underline'>
                Log in
              </Link>
            </div>
          </div>
        </div>
        <div className='hidden lg:block lg:w-1/2'>
          <div className='relative h-full w-full bg-[#4F46E5]'>
            <div className='absolute inset-0 flex flex-col items-center justify-center p-8'>
              <Image
                src={authImg1}
                alt='Focus illustration'
                width={400}
                height={400}
                className='mb-8'
                priority
              />
              <h2 className='text-center text-4xl font-bold text-white'>
                Supercharge Your Next Focus Session
              </h2>
            </div>
          </div>
        </div>
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  )
}
