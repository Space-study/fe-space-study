import {useOnClickOutside} from '@/core/hooks/useOnClickOutside'
import {Column} from '@src/core/types/board'
import {Plus} from 'lucide-react'
import React, {memo, useRef, useState} from 'react'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {BoardColumn} from './BoardColumn'
import {useBoard} from './BoardContext'
import CreateColumnModal from './CreateColumnModal'

export const Board: React.FC = memo(() => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const {state, addColumn, editColumn, deleteColumn, addTask, moveTask} = useBoard()
  const modalRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(modalRef, () => setIsCreateModalOpen(false))

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-6'>
        <div className='flex space-x-4 overflow-x-auto pb-4'>
          {state.columns.map((column: Column) => (
            <BoardColumn
              key={column.id}
              column={column}
              onAddTask={addTask}
              onMoveTask={moveTask}
              onEditColumn={editColumn}
              onDeleteColumn={deleteColumn}
            />
          ))}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='w-72 p-3 flex items-center justify-center text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200'>
            <Plus className='w-4 h-4 mr-1' />
            Add column
          </button>
        </div>
      </div>

      <CreateColumnModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateColumn={addColumn}
      />
    </DndProvider>
  )
})

Board.displayName = 'Board'
