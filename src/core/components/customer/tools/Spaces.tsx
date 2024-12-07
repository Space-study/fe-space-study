import {MovableCard} from '@/core/components/common/MovableCard'
import React from 'react'

interface SpacesProps {
  visible: boolean
  toggleCard: () => void
}

export const Spaces: React.FC<SpacesProps> = ({visible, toggleCard}) => {
  return (
    <MovableCard visible={visible} className='spaces' toggleCard={toggleCard}>
      Spaces
    </MovableCard>
  )
}
