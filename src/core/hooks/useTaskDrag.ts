import {Task} from '@/core/types/board'
import {useDrag} from 'react-dnd'

export const useTaskDrag = (task: Task, columnId: string, index: number) => {
  const [{isDragging}, drag] = useDrag({
    type: 'TASK',
    item: {type: 'TASK', id: task.id, columnId, index, task},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return {isDragging, drag}
}
