import {Issue} from '@/core/types/board'
import {useDrag} from 'react-dnd'

export const useTaskDrag = (issue: Issue, columnId: string, index: number) => {
  const [{isDragging}, drag] = useDrag({
    type: 'TASK',
    item: {type: 'TASK', id: issue.id, columnId, index, issue},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return {isDragging, drag}
}
