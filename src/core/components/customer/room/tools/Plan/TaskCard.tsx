import {useTaskDrag} from '@/core/hooks/useTaskDrag'
import {Task} from '@/core/types/board'
import React, {memo} from 'react'

interface TaskCardProps {
  task: Task
  columnId: string
  index: number
}

export const TaskCard: React.FC<TaskCardProps> = memo(({task, columnId, index}) => {
  const {isDragging, drag} = useTaskDrag(task, columnId, index)
  console.log('drag', drag)
  return (
    <div
      // ref={drag}
      className={`p-3 bg-white rounded-lg shadow mb-2 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } hover:shadow-md transition-shadow duration-200`}>
      <h4 className='font-medium text-gray-800'>{task.title}</h4>
      {task.description && <p className='text-sm text-gray-600 mt-1'>{task.description}</p>}
      <div className='flex items-center justify-between mt-2'>
        <span
          className={`text-xs px-2 py-1 rounded ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-800'
              : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}>
          {task.priority}
        </span>
        {task.assignee && <span className='text-xs text-gray-500'>{task.assignee}</span>}
      </div>
    </div>
  )
})

TaskCard.displayName = 'TaskCard'
