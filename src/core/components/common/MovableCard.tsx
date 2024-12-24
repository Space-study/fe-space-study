import React, {MouseEvent, ReactNode, useState} from 'react'
import {MdClose} from 'react-icons/md'

interface MovableCardProps {
  className?: string
  children: ReactNode
  visible: boolean
  toggleCard: () => void
}

export function MovableCard({className = '', children, visible, toggleCard}: MovableCardProps) {
  const [isDragging, setDragging] = useState(false)
  const [position, setPosition] = useState({top: 100, left: 100})
  const [eventDisplacement, setEventDisplacement] = useState({top: 0, left: 0})

  const handleMouseDown = (e: MouseEvent) => {
    setDragging(true)
    const {pageX: left, pageY: top} = e
    setEventDisplacement({left: position.left - left, top: position.top - top})
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) {
      return
    }
    const {pageX: left, pageY: top} = e
    setPosition({top: top + eventDisplacement.top, left: left + eventDisplacement.left})
  }

  return (
    <div
      className={`absolute ${visible ? 'block' : 'hidden'} ${className}`}
      style={{top: `${position.top}px`, left: `${position.left}px`}}>
      <div
        className={`p-2 rounded-t-lg cursor-grab dark:bg-gray-700 dark:text-white bg-gray-200 text-black `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}>
        <div className='flex justify-between items-center bg-blue-500 dark:bg-red-500'>
          <div className='flex items-center justify-center h-4/5 aspect-square cursor-pointer rounded hover:border hover:border-gray-500'>
            <MdClose className='text-gray-600 dark:text-white' onClick={toggleCard} />
          </div>
        </div>
      </div>
      <div
        className={
          'w-full gap-2 flex flex-col p-4 rounded-b-lg shadow-md dark:bg-white dark:text-black bg-gray-900 text-white'
        }>
        {children}
      </div>
    </div>
  )
}
