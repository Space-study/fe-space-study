import {useColumnDrop} from '@/core/hooks/useColumnDrop'
import {Column, Task} from '@/core/types/board'
import {Plus} from 'lucide-react'
import React, {memo} from 'react'
import {ColumnMenu} from './ColumnMenu'
import {TaskCard} from './TaskCard'

interface BoardColumnProps {
  column: Column
  onAddTask: (columnId: string, task: Partial<Task>) => void
  onMoveTask: (
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void
  onEditColumn: (columnId: string, title: string) => void
  onDeleteColumn: (columnId: string) => void
}

export const BoardColumn: React.FC<BoardColumnProps> = memo(
  ({column, onAddTask, onMoveTask, onEditColumn, onDeleteColumn}) => {
    const {isOver, drop} = useColumnDrop(column.id, onMoveTask)

    return (
      <div
        ref={drop}
        className={`w-72 bg-gray-100 rounded-lg p-3 flex flex-col ${isOver ? 'bg-gray-200' : ''}`}>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-2'>
            <h3 className='font-medium text-gray-800'>{column.title}</h3>
            <span className='text-sm text-gray-500'>({column.tasks.length})</span>
          </div>
          <ColumnMenu
            columnId={column.id}
            onEditColumn={onEditColumn}
            onDeleteColumn={onDeleteColumn}
          />
        </div>

        <div className='flex-1 overflow-y-auto min-h-[200px]'>
          {column.tasks.map((task, index) => (
            <TaskCard key={`${task.id}-${column}`} task={task} columnId={column.id} index={index} />
          ))}
        </div>

        <button
          onClick={() => onAddTask(column.id, {title: `New Task ${column.tasks.length + 1}`})}
          className='mt-2 w-full p-2 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded'>
          <Plus className='w-4 h-4 mr-1' />
          Add task
        </button>
      </div>
    )
  },
)

BoardColumn.displayName = 'BoardColumn'
