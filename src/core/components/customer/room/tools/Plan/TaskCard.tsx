import {Badge} from '@/core/components/ui/badge'
import {useTaskDrag} from '@/core/hooks/useTaskDrag'
import {Issue} from '@/core/types/board'
import {format} from 'date-fns'
import {CalendarIcon, Clock, User, Users} from 'lucide-react'
import {useRouter} from 'next/navigation'
import React, {memo} from 'react'

interface TaskCardProps {
  issue: Issue
  columnId: string
  index: number
}

export const TaskCard: React.FC<TaskCardProps> = memo(({issue, columnId, index}) => {
  const {isDragging, drag} = useTaskDrag(issue, columnId, index)
  const router = useRouter()

  const handleClick = () => {
    router.push(`/room/issue/${issue.id}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Helper to format time (convert hours to days if needed)
  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d ${hours % 24}h`
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={drag as any}
      onClick={handleClick}
      className={`p-3 bg-white rounded-lg shadow mb-2 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } hover:shadow-md transition-shadow duration-200`}>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-medium text-gray-800 line-clamp-1'>{issue.title}</h4>
        <Badge variant='outline' className={getPriorityColor(issue.priority)}>
          {issue.priority}
        </Badge>
      </div>

      {/* {issue.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{issue.description}</p>
      )} */}

      {/* Time tracking */}
      {((issue.timeEstimate && issue.timeEstimate > 0) ||
        (issue.timeSpent && issue.timeSpent > 0)) && (
        <div className='flex items-center gap-4 text-xs text-gray-500 mt-2'>
          {issue.timeEstimate && issue.timeEstimate > 0 && (
            <div className='flex items-center'>
              <Clock className='w-3 h-3 mr-1' />
              <span>Est: {formatTime(issue.timeEstimate)}</span>
            </div>
          )}

          {issue.timeSpent && issue.timeSpent > 0 && (
            <div className='flex items-center'>
              <Clock className='w-3 h-3 mr-1' />
              <span>Spent: {formatTime(issue.timeSpent)}</span>
            </div>
          )}
        </div>
      )}

      {/* People */}
      <div className='flex items-center justify-between text-xs text-gray-500 mt-2'>
        <div className='flex items-center gap-2'>
          {issue.assignee && (
            <div className='flex items-center'>
              <User className='w-3 h-3 mr-1' />
              <span>{issue.assignee}</span>
            </div>
          )}

          {issue.participants && issue.participants.length > 0 && (
            <div className='flex items-center'>
              <Users className='w-3 h-3 mr-1' />
              <span>{issue.participants.length}</span>
            </div>
          )}
        </div>

        <div className='flex items-center'>
          <CalendarIcon className='w-3 h-3 mr-1' />
          <time dateTime={issue.createdAt.toISOString()}>
            {format(issue.createdAt, 'MMM d, yyyy')}
          </time>
        </div>
      </div>
    </div>
  )
})

TaskCard.displayName = 'TaskCard'

export default TaskCard
