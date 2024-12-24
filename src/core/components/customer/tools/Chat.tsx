import {StaticCard} from '@/core/components/common/StaticCard'
import React from 'react'

interface ChatCardProps {
  visible: boolean
  toggleCard: () => void
}

export const Chat: React.FC<ChatCardProps> = ({visible, toggleCard}) => {
  if (!visible) return null

  return (
    <StaticCard
      className='absolute top-0 right-0 w-[400px] h-full bg-white shadow-lg flex flex-col'
      wrapClassName='w-full h-full rounded-lg shadow p-4 flex flex-col'
      visible={visible}
      toggleCard={toggleCard}>
      {/* Header */}
      <div className='flex items-center justify-between border-b pb-2'>
        <h2 className='text-neutral-950 font-medium'>Chat</h2>
        <button
          onClick={toggleCard} // Close the card when this button is clicked
          className='text-neutral-500 hover:text-neutral-700 transition'>
          <span className='material-symbols-outlined'>close</span>
        </button>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto py-4 space-y-4'>
        {/* Sender Message */}
        <div className='flex items-start gap-3'>
          <div className='w-[32px] h-[32px] rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 font-medium'>
            D
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-neutral-950'>Fernix8</span>
              <span className='px-2 py-0.5 bg-primary-100 text-primary-700 rounded-md text-xs'>
                Host
              </span>
              <span className='text-neutral-500 text-xs'>11:43am</span>
            </div>
            <p className='bg-neutral-100 p-3 rounded-lg text-neutral-800 text-sm'>
              Hello, how are you today?
            </p>
          </div>
        </div>

        {/* Recipient Message */}
        <div className='flex items-end justify-end gap-3'>
          <div>
            <div className='flex items-center justify-end gap-2'>
              <span className='text-neutral-500 text-xs'>11:44am</span>
              <span className='px-2 py-0.5 bg-primary-500 text-neutral-800 rounded-md text-xs'>
                You
              </span>
            </div>
            <p className='bg-neutral-100 p-3 rounded-lg text-neutral-800 text-sm'>
              I'm good, thanks!
            </p>
          </div>
          <div className='w-[32px] h-[32px] rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 font-medium'>
            J
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='border-t pt-4'>
        <div className='flex items-center gap-2 border rounded-md px-3 py-2'>
          <input
            type='text'
            placeholder='Say something'
            className='flex-1 outline-none bg-transparent text-neutral-950'
          />
          <button>
            <span className='material-symbols-outlined text-gray-900'>send</span>
          </button>
        </div>
      </div>
    </StaticCard>
  )
}
