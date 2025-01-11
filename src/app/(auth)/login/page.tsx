'use client'
import {useRouter} from 'next/navigation'
import React, {useState} from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa'
import {FcGoogle} from 'react-icons/fc'
// import LogoComponent from '@/components/Logo/Logo.component';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/room')
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handleGoogleLogin = () => {
    console.log('Logging in with Google...')
    // Simulate Google login and redirect to home
    router.push('/room')
  }

  return (
    <div className='bg-white flex flex-col md:flex-row min-h-screen'>
      {/* Left side - Login Form */}
      <div className='flex flex-col justify-between items-center w-full md:w-1/2 p-6'>
        {/* Top Section for Logo */}
        <div className='w-2/3 flex justify-start items-center pt-10'>
          {/* <LogoComponent /> */}
          Logo
        </div>

        {/* Middle Section for Form */}
        <div className='w-2/3 bg-white rounded-lg shadow-lg p-8 mt-6'>
          <h1 className='text-3xl font-bold mb-6 text-left text-gray-800'>Sign In</h1>
          <form onSubmit={handleSubmit}>
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
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  onClick={handleTogglePasswordVisibility}
                  className='absolute inset-y-0 right-3 flex items-center text-gray-600'>
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>

            <div className='bg-white flex items-center mb-6'>
              <input
                type='checkbox'
                id='remember'
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className='mr-2 bg-white'
              />
              <label htmlFor='remember' className='text-sm text-gray-800'>
                Remember me
              </label>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded'>
              Sign In
            </button>
          </form>

          <div className='my-6 text-center'>
            <button
              onClick={handleGoogleLogin}
              className='w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded flex items-center justify-center'>
              <FcGoogle className='mr-2 size-8' />
              Sign in with Google
            </button>
          </div>

          <div className='mt-6 text-center'>
            <a href='/forgot-password' className='text-blue-500 hover:underline'>
              Forgot password?
            </a>
          </div>

          <div className='mt-6 text-center'>
            <span className='text-gray-500'>Don&apos;t have an account?</span>
            <a href='/register' className='ml-2 text-blue-500 hover:underline'>
              Create Account
            </a>
          </div>
        </div>

        {/* Bottom Section (Optional) */}
        <div className='w-full text-center text-sm text-gray-500 mt-6'>
          {/* Add footer or additional info if needed */}
        </div>
      </div>

      {/* Right side - Background Image, hidden on mobile */}
      <div
        className='hidden md:block md:w-1/2 bg-cover bg-center'
        style={{
          backgroundImage:
            "url('https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg')",
        }}></div>
    </div>
  )
}

export default Login
