import { useDrop } from 'react-dnd';
import { Task } from '../types/board';

interface DragItem {
  type: string;
  id: string;
  columnId: string;
  index: number;
  task: Task;
}

export const useColumnDrop = (
  columnId: string,
  onMoveTask: (sourceColumnId: string, destinationColumnId: string, sourceIndex: number, destinationIndex: number) => void
) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: DragItem) => {
      if (item.columnId !== columnId) {
        onMoveTask(
          item.columnId,
          columnId,
          item.index,
          0 // Add to the top of the new column
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return { isOver, drop };
};