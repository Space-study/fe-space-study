import React, {useEffect, useState} from 'react'
import {Board} from './Board'
import {BoardProvider} from './BoardContext'

const PlanPage: React.FC = () => {
  const [roomId, setRoomId] = useState<number | null>(null)

  useEffect(() => {
    // Extract the room ID from the URL path
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const roomMatch = pathname.match(/\/room\/(\d+)/)
      if (roomMatch && roomMatch[1]) {
        const id = Number(roomMatch[1])
        console.log('PlanPage: Extracted room ID from URL:', id)
        setRoomId(id)
      } else {
        console.warn('PlanPage: Could not extract room ID from pathname:', pathname)
      }
    }
  }, [])

  if (!roomId) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500'>Loading room data...</p>
      </div>
    )
  }

  return (
    <BoardProvider roomId={roomId}>
      <div className='h-screen flex flex-col'>
        <div className='flex-1 overflow-hidden'>
          <Board roomId={roomId} />
        </div>
      </div>
    </BoardProvider>
  )
}

export default PlanPage
