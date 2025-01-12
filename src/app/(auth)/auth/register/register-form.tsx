'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@src/core/components/ui/button'
import {Form, FormControl, FormField, FormItem, FormMessage} from '@src/core/components/ui/form'
import {Input} from '@src/core/components/ui/input'
import {Separator} from '@src/core/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {FcGoogle} from 'react-icons/fc'
import {registerSchema, type RegisterData} from '../../../../core/utils/validation/auth'

export default function RegisterForm() {
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: RegisterData) {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/email/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        console.log('Registration failed:', response)
      }

      console.log('Registration successful')

      alert('Registration successful. Please verify your email to continue.')
      form.reset()
    } catch (err) {
      console.error('Error during registration:', err)
    }
  }

  return (
    <div className='flex min-h-screen'>
      <div className='flex w-full items-center justify-center lg:w-1/2'>
        <div className='mx-auto w-full max-w-sm space-y-6 px-4'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-semibold text-gray-900'>Create your FocusHub account</h1>
          </div>
          <Button variant='outline' className='w-full justify-center gap-2' type='button'>
            <FcGoogle className='mr-2 size-8' />
            Sign up with Google
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
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='First Name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='Last Name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='email'
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Email' type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Password' type='password' {...field} />
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
                {form.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <div className='text-center text-sm text-gray-500'>
            By signing up, you agree to our{' '}
            <Link href='/terms' className='text-[#4F46E5] hover:underline'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href='/privacy' className='text-[#4F46E5] hover:underline'>
              Privacy Policy
            </Link>
          </div>
          <div className='text-center text-sm'>
            {'Already have an account? '}
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
              src='../../../public/illustrations/focus.svg'
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
