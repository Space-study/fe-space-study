'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@src/core/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormMessage} from '@src/core/components/ui/form'
import {Input} from '@src/core/components/ui/input'
import {Separator} from '@src/core/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa'
import {FcGoogle} from 'react-icons/fc'
import {loginSchema, type LoginData} from '../../../../core/utils/validation/auth'
import authImg1 from '../authImg1.webp'

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched', // Validate on touch
  })

  async function onSubmit(data: LoginData) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/email/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        form.setError('root', {
          message: 'Login failed. Please check your credentials.',
        })
        return
      }

      const result = await response.json()
      localStorage.setItem('accessToken', result?.token)
      router.push('/')
    } catch (error) {
      console.error('Error during login:', error)
      form.setError('root', {
        message: 'An error occurred. Please try again.',
      })
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handleGoogleLogin = () => {
    router.push('/')
  }

  return (
    <div className='flex min-h-screen '>
      <div className='flex w-full items-center justify-center lg:w-1/2'>
        <div className='mx-auto w-full max-w-sm space-y-6 px-4'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-semibold text-gray-900 text-left'>Continue to FocusHub</h1>
          </div>
          <Button
            variant='outline'
            className='w-full justify-center gap-2'
            type='button'
            onClick={handleGoogleLogin}>
            <FcGoogle className='mr-2 size-8' />
            Sign in with Google
          </Button>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>or</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({field, fieldState}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Email'
                        type='email'
                        {...field}
                        className={`${
                          fieldState.invalid
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({field, fieldState}) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='Password'
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className={`${
                            fieldState.invalid
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-indigo-500'
                          }`}
                        />
                        <button
                          type='button'
                          onClick={handleTogglePasswordVisibility}
                          className='absolute inset-y-0 right-3 flex items-center text-gray-600'>
                          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className='text-sm text-red-500'>{form.formState.errors.root.message}</div>
              )}
              <Button
                type='submit'
                className='w-full bg-[#4F46E5] hover:bg-[#4338CA]'
                disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className='text-center text-sm'>
            <Link href='/forgot-password' className='text-[#4F46E5] hover:underline'>
              Forgot password?
            </Link>
          </div>
          <div className='text-center text-sm text-gray-500'>
            Don&apos;t have an account?{' '}
            <Link href='/auth/register' className='text-[#4F46E5] hover:underline'>
              Create Account
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
