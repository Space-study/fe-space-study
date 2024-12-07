'use client'

import {Menu} from '@/core/components/customer/MenuControlTool'
import {OtherControl} from '@/core/components/customer/OtherControl'
import {Music} from '@/core/components/customer/tools/Music'
import {Spaces} from '@/core/components/customer/tools/Spaces'
import {Tasks} from '@/core/components/customer/tools/Tasks'
import {Timer} from '@/core/components/customer/tools/Timer'
import {useTheme} from '@/core/hooks/useTheme'
import React, {ReactNode, useEffect, useState} from 'react'

interface RoomProps {
  children: ReactNode
}

interface ActiveTools {
  spaces: boolean
  timer: boolean
  music: boolean
  tasks: boolean
}

const RoomPageClient = ({children}: RoomProps) => {
  const [activeTools, setActiveTools] = useState<ActiveTools>({
    spaces: false,
    timer: false,
    music: false,
    tasks: false,
  })

  const handleToolChange = (name: string) => {
    setActiveTools(prev => ({
      ...prev,
      [name as keyof ActiveTools]: !prev[name as keyof ActiveTools],
    }))
  }

  return (
    <div className='relative flex flex-col h-screen w-screen overflow-hidden bg-zinc-50  dark:bg-gray-900 dark:text-white'>
      <OtherControl />
      <Menu setTool={handleToolChange} />
      <div className='flex-grow flex flex-col lg:flex-row'>
        <Tasks visible={activeTools.tasks} toggleCard={() => handleToolChange('tasks')} />
        <Timer visible={activeTools.timer} toggleCard={() => handleToolChange('timer')} />
        <Spaces visible={activeTools.spaces} toggleCard={() => handleToolChange('spaces')} />
        <Music visible={activeTools.music} toggleCard={() => handleToolChange('music')} />
        <main className='flex-grow p-4'>{children}</main>
      </div>
    </div>
  )
}

export default RoomPageClient
