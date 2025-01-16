import Board from '@/core/components/customer/room/Board'
import Icon from '@/core/components/customer/room/Icon'
import ModalButton from '@/core/components/customer/room/ModalButton'
import Sound from '@/core/components/customer/room/tools/Sound'

function SoundModal() {
  return (
    <Board>
      <Board.Open opens='soundModal'>
        <ModalButton
          icon={<Icon name='Rain' />}
          tooltip='Set sound'
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Board.Open>
      <Board.Window name='soundModal'>
        <Sound minimized={false} />
      </Board.Window>
    </Board>
  )
}

export default SoundModal
