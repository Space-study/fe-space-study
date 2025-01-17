import { useDrag } from 'react-dnd';
import { Task } from '@/core/types/board';

export const useTaskDrag = (task: Task, columnId: string, index: number) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { type: 'TASK', id: task.id, columnId, index, task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { isDragging, drag };
};
