import {SquareButton} from '@/core/components/common/SquareButton'
import React from 'react'
import {FaMusic, FaStopwatch, FaTasks, FaVideo} from 'react-icons/fa'

interface MenuProps {
  setTool: (tool: string) => void
}

export const Menu: React.FC<MenuProps> = ({setTool}) => (
  <div
    className='absolute top-1/2 left-[10px] transform translate-y-[-50%] border border-transparent
   transition-all duration-100 text-[0.7rem] px-[0.45rem] dark:bg-white dark:text-gray-900 bg-gray-900 text-white  w-16 flex flex-col items-center py-4 space-y-4'>
    <SquareButton
      icon={FaVideo}
      label='Spaces'
      onClick={() => setTool('spaces')}
      color='text-blue-500 dark:text-yellow-500 hover:text-blue-700 dark:hover:text-yellow-300'
    />
    <SquareButton
      icon={FaStopwatch}
      label='Timer'
      onClick={() => setTool('timer')}
      color='text-green-500 dark:text-red-500 hover:text-green-700 dark:hover:text-red-300'
    />
    <SquareButton
      icon={FaMusic}
      label='Music'
      onClick={() => setTool('music')}
      color='text-purple-500 dark:text-pink-500 hover:text-purple-700 dark:hover:text-pink-300'
    />
    <SquareButton
      icon={FaTasks}
      label='Tasks'
      onClick={() => setTool('tasks')}
      color='text-yellow-500 dark:text-teal-500 hover:text-yellow-700 dark:hover:text-teal-300'
    />
  </div>
)
