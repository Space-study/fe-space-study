import React from 'react'
import {Board} from './Board'
import {BoardProvider} from './BoardContext'

const PlanPage: React.FC = () => {
  return (
    <BoardProvider>
      <div className='h-screen flex flex-col'>
        <div className='flex-1 overflow-hidden'>
          <Board />
        </div>
      </div>
    </BoardProvider>
  )
}

export default PlanPage
