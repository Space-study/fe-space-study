import Board from '@/core/components/customer/room/Board'
import Icon from '@/core/components/customer/room/Icon'
import ModalButton from '@/core/components/customer/room/ModalButton'
import CalendarWithNotes from './CalendarWithNotes'

export default function Calendar() {
  return (
    <Board>
      <Board.Open opens='calendar'>
        <ModalButton
          icon={<Icon name='Calendar' />}
          tooltip='Todo List'
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Board.Open>
      <Board.Window name='calendar' width='w-full'>
        <CalendarWithNotes />
      </Board.Window>
    </Board>
  )
}
