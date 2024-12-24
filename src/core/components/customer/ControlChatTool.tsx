import React from 'react'
import {FaRocketchat} from 'react-icons/fa'

interface MenuProps {
  setTool: (tool: string) => void
}

export const ControlChat: React.FC<MenuProps> = ({setTool}) => (
  <div className='absolute bottom-2 right-[30px] transform translate-y-[-50%] transition-all duration-100 text-[0.7rem] px-[0.45rem] w-16 flex flex-col items-center py-4 space-y-4'>
    <button
      onClick={() => setTool('chat')}
      className='w-16 h-16 flex items-center justify-center border-[4px] border-transparent rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900
      animate-slow-bounce
      bg-[var(--main-bg)] 
      hover:border-[var(--gradient-border)] focus:border-[var(--gradient-border)]
      transition-all duration-300 ease-in-out'>
      <FaRocketchat className='text-xl' />
    </button>
  </div>
)
