import Board from '@/core/components/customer/room/Board'
import Icon from '@/core/components/customer/room/Icon'
import ModalButton from '@/core/components/customer/room/ModalButton'
import TodoList from '@/core/components/customer/room/tools/TodoList'

export default function TodoListContent() {
  return (
    <Board>
      <Board.Open opens='todoList'>
        <ModalButton
          icon={<Icon name='List' />}
          tooltip='Todo List'
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Board.Open>
      <Board.Window name='todoList'>
        <TodoList />
      </Board.Window>
    </Board>
  )
}
