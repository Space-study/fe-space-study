import {useDrop} from 'react-dnd'
import {Issue} from '../types/board'

interface DragItem {
  type: string
  id: string
  columnId: string
  index: number
  issue: Issue
}

export const useColumnDrop = (
  columnId: string,
  onMoveIssue: (issueId: string, newStatus: string) => void,
) => {
  const [{isOver}, drop] = useDrop({
    accept: 'TASK',
    drop: (item: DragItem) => {
      console.log('Dropping item:', item)
      console.log('Item issue:', item.issue)
      console.log('Item issue ID:', item.issue.id)
      console.log('Target column ID:', columnId)

      if (item.columnId !== columnId) {
        onMoveIssue(item.issue.id, columnId)
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  })

  return {isOver, drop}
}
