'use client'

import type {RootState} from '@/core/redux/store'
import React from 'react'
import {useSelector} from 'react-redux'

const Scenes: React.FC = () => {
  const currentBackground = useSelector((state: RootState) => state.background.currentBackground)

  return (
    <div
      className='absolute min-h-screen w-full bg-cover bg-center'
      style={{backgroundImage: `url(${currentBackground})`}}>
      {/* Content of the room goes here */}
    </div>
  )
}

export default Scenes
