import Board from '@/core/components/customer/room/Board'
import Icon from '@/core/components/customer/room/Icon'
import ModalButton from '@/core/components/customer/room/ModalButton'
import Countdown from './Countdown'

function Time() {
  return (
    <Board>
      <Board.Open opens='time'>
        <ModalButton
          icon={<Icon name='Clock' />}
          tooltip='Set Time'
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Board.Open>
      <Board.Window name='time'>
        <Countdown />
      </Board.Window>
    </Board>
  )
}

export default Time
