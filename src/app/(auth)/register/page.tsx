'use client'

import {useRouter} from 'next/navigation'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form'

type RegisterFormInputs = {
  email: string
  password: string
  firstName: string
  lastName: string
}

const Register = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterFormInputs>()

  const onSubmit = async (data: RegisterFormInputs) => {
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

      // Redirect to login page
      router.push('/login')
    } catch (err) {
      if (typeof err === 'string') {
        setServerError(err) // Handle string errors
      } else if (err instanceof Error) {
        setServerError(err.message) // Handle Error objects
      } else {
        setServerError('An unknown error occurred.') // Handle other cases
      }
    }
  }

  return (
    <div className='bg-white flex flex-col md:flex-row min-h-screen'>
      {/* Left side - Registration Form */}
      <div className='flex flex-col justify-center items-center w-full md:w-1/2 p-6'>
        <div className='w-2/3 bg-white rounded-lg shadow-lg p-8 mt-6'>
          <h1 className='text-3xl font-bold mb-6 text-left text-gray-800'>Register</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='firstName'>
                First Name
              </label>
              <input
                id='firstName'
                type='text'
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                {...register('firstName', {
                  required: 'First Name is required',
                  minLength: {value: 2, message: 'First Name must be at least 2 characters'},
                  pattern: {value: /^[A-Za-z]+$/, message: 'First Name must contain only letters'},
                })}
              />
              {errors.firstName && (
                <span className='text-red-500 text-sm'>{errors.firstName.message}</span>
              )}
            </div>

            {/* Last Name */}
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='lastName'>
                Last Name
              </label>
              <input
                id='lastName'
                type='text'
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                {...register('lastName', {
                  required: 'Last Name is required',
                  minLength: {value: 2, message: 'Last Name must be at least 2 characters'},
                  pattern: {value: /^[A-Za-z]+$/, message: 'Last Name must contain only letters'},
                })}
              />
              {errors.lastName && (
                <span className='text-red-500 text-sm'>{errors.lastName.message}</span>
              )}
            </div>

            {/* Email */}
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                type='email'
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white ${
                  errors.email ? 'border-red-500' : ''
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email format',
                  },
                })}
              />
              {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                type='password'
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white ${
                  errors.password ? 'border-red-500' : ''
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {value: 6, message: 'Password must be at least 6 characters long'},
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/,
                    message:
                      'Password must contain at least one letter, one number, and one special character',
                  },
                })}
              />
              {errors.password && (
                <span className='text-red-500 text-sm'>{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded'>
              Register
            </button>
          </form>

          {/* Server Error Message */}
          {serverError && <p className='text-red-500 mt-4 text-center'>{serverError}</p>}
          <div className='mt-6 text-center'>
            <span className='text-gray-500'>Already have an account?</span>
            <a href='/login' className='ml-2 text-blue-500 hover:underline'>
              Sign In
            </a>
          </div>
        </div>
      </div>
      {/* Right side - Background Image */}
      <div
        className='hidden md:block md:w-1/2 bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg')",
        }}></div>
    </div>
  )
}

export default Register
