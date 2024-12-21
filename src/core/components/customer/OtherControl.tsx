'use client'

import {IconButton} from '@/core/components/common/SquareButton'
import {useTheme} from 'next-themes'
import {useRouter} from 'next/navigation'
import React, {useEffect, useState} from 'react'
import {FaExpand, FaMoon, FaSignOutAlt, FaSun} from 'react-icons/fa'

export const OtherControl: React.FC = () => {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFullScreen = () => {
    const elem = document.documentElement

    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      elem.requestFullscreen?.()
    }
  }

  const handleOutRoom = () => {
    router.push('/')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className='absolute top-8 right-1/2 transform translate-x-1/2 flex items-center gap-4 border border-gray-700 p-3 rounded-lg bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg'>
      {/* Fullscreen Button */}
      <IconButton
        icon={FaExpand}
        onClick={handleFullScreen}
        className='hover:bg-blue-900 hover:bg-opacity-20 transition-all duration-300 rounded-full p-3'
        aria-label='Toggle Fullscreen'
        color='text-blue-400 hover:text-gray-500'
      />

      {/* Theme Toggle Button */}
      <IconButton
        icon={theme === 'light' ? FaSun : FaMoon}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className='hover:bg-gray-900 hover:bg-opacity-20 transition-all duration-300 rounded-full p-3'
        aria-label='Toggle Theme'
        color={theme === 'light' ? 'text-yellow-500' : 'text-orange-500'}
      />

      <IconButton
        icon={FaSignOutAlt}
        onClick={handleOutRoom}
        className='hover:bg-blue-900 hover:bg-opacity-20 transition-all duration-300 rounded-full p-3'
        aria-label='Sign Out'
        color='text-red-400 dark:text-yellow-400 hover:text-gray-500 dark:hover:text-gray-300'
      />
    </div>
  )
}
