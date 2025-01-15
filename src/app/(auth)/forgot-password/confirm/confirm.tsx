'use client'

import {forgotPasswordSchema, type ForgotPasswordData} from '@/core/utils/validation/auth'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@src/core/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormMessage} from '@src/core/components/ui/form'
import {Input} from '@src/core/components/ui/input'
import {Separator} from '@src/core/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import authImg1 from '../../auth/authImg1.webp'

export default function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onTouched',
  })

  async function onSubmit(data: ForgotPasswordData) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/forgot/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json() // Parse the error response
        alert(`Registration failed: ${errorData.message || 'Something went wrong.'}`)
      } else {
        alert('Registration successful. Please verify your email to continue.')
      }

      form.reset() // Reset the form
    } catch (err) {
      console.error('Error during registration:', err)
      alert('An unexpected error occurred. Please try again later.')
    }
  }

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
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Email'
                        type='email'
                        className={
                          form.formState.errors.email ? 'border-red-500' : 'border-gray-300'
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
                {form.formState.isSubmitting ? 'Sending...' : 'Send'}
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
