'use client'

import Header from '@/core/components/customer/room/Header'
import Scenes from '@/core/components/customer/room/Scenes'
import React, {useEffect, useState} from 'react'

const RoomPageClient: React.FC = () => {
  // const [isMobileView, setIsMobileView] = useState(false)
  // const [isStarted, setIsStarted] = useState(false)
  // const [isAnimating, setIsAnimating] = useState(false)

  // const handleStart = () => {
  //   setIsAnimating(true)
  //   setTimeout(() => {
  //     setIsStarted(true)
  //   }, 300)
  // }

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobileView(window.innerWidth <= 768)
  //   }

  //   // const handleKeyDown = (e: KeyboardEvent) => {
  //   //   if (e.key === 'Enter') {
  //   //     handleStart()
  //   //   }
  //   // }

  //   handleResize()
  //   window.addEventListener('resize', handleResize)
  //   // window.addEventListener('keydown', handleKeyDown)

  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //     // window.removeEventListener('keydown', handleKeyDown)
  //   }
  // }, [])

  return (
    <div className='relative min-h-screen'>
      {/* Startup Screen */}
      {/* {!isStarted && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
            isAnimating ? 'animate-scaleOut' : 'animate-scaleIn'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logowhite.png"
              alt="logo"
              className="w-[50%] h-[50%]"
            />
            <h1 className="text-white text-2xl animate-blink">
              Press Enter to start
            </h1>
          </div>
        </div>
      )} */}

      {/* Main Room Content */}
      <Scenes />
      <Header />
      {/* {isStarted && (
        <>
          <Header />
         <Music /> 
        </>
      )} */}

      {/* Mobile View Warning */}
      {/* {isMobileView && (
        <div className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center backdrop-blur-md'>
          <img src='/responsive.png' alt='mobile' className='w-1/2 h-auto rounded-md' />
        </div>
      )} */}
    </div>
  )
}

export default RoomPageClient
