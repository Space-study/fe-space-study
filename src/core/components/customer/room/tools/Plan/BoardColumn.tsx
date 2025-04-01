import {useColumnDrop} from '@/core/hooks/useColumnDrop'
import {Column} from '@/core/types/board'
import React, {useRef} from 'react'
import {useBoard} from './BoardContext'
import {CreateIssueDialog} from './CreateIssueDialog'
import {TaskCard} from './TaskCard'

interface BoardColumnProps {
  column: Column
}

export const BoardColumn: React.FC<BoardColumnProps> = ({column}) => {
  const {addIssue, moveIssue} = useBoard()
  const contentRef = useRef<HTMLDivElement>(null)

  // Initialize the drop functionality with proper callback
  const {isOver, drop} = useColumnDrop(column.id, (issueId: string, newStatus: string) => {
    moveIssue(issueId, newStatus)
  })

  const handleCreateIssue = (title: string, description: string) => {
    addIssue({
      title,
      description,
      status: column.id,
      timeEstimate: 0,
      timeSpent: 0,
    })
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={drop as any}
      className={`w-72 flex-shrink-0 flex flex-col rounded-lg ${
        isOver ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
      <div className='p-3 font-medium text-gray-900 border-b border-gray-200 flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <span>{column.title}</span>
          <span className='bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs'>
            {column.issues?.length || 0}
          </span>
        </div>
      </div>

      <div ref={contentRef} className='flex-1 p-2 overflow-y-auto max-h-[calc(100vh-250px)]'>
        {column.issues?.map((issue, index) => (
          <TaskCard key={issue.id} issue={issue} columnId={column.id} index={index} />
        ))}
      </div>

      <div className='p-2'>
        <CreateIssueDialog columnId={column.id} onCreateIssue={handleCreateIssue} />
      </div>
    </div>
  )
}
