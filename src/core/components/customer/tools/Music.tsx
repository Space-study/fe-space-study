import {MovableCard} from '@/core/components/common/MovableCard'
import React from 'react'

interface MusicProps {
  visible: boolean
  toggleCard: () => void
}

// Convert to use const with an arrow function
export const Music: React.FC<MusicProps> = ({visible, toggleCard}) => {
  return (
    <MovableCard visible={visible} className='music' toggleCard={toggleCard}>
      Tasks
    </MovableCard>
  )
}
