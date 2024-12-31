'use client'

import {useRouter} from 'next/navigation'
import React, {useState} from 'react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    // Validation
    if (!email || !password || !firstName || !lastName) {
      setError('All fields are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    try {
      // Mock API call
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password, firstName, lastName}),
      })

      if (response.ok) {
        console.log('Registration successful')
        router.push('/login')
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed.')
      }
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred.')
    }
  }

  return (
    <div className='bg-white flex flex-col md:flex-row min-h-screen'>
      {/* Left side - Registration Form */}
      <div className='flex flex-col justify-center items-center w-full md:w-1/2 p-6'>
        <div className='w-2/3 bg-white rounded-lg shadow-lg p-8 mt-6'>
          <h1 className='text-3xl font-bold mb-6 text-left text-gray-800'>Register</h1>
          <form onSubmit={handleSubmit}>
            {error && <div className='mb-4 text-red-500'>{error}</div>}
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='firstName'>
                First Name
              </label>
              <input
                id='firstName'
                type='text'
                className='w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white'
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='lastName'>
                Last Name
              </label>
              <input
                id='lastName'
                type='text'
                className='w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white'
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                id='email'
                type='email'
                className='w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-6'>
              <label className='block text-gray-800 text-sm font-bold mb-2' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                type='password'
                className='w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded'>
              Register
            </button>
          </form>
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
