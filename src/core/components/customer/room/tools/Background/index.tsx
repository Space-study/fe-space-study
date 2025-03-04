import Icon from '@/core/components/customer/room/Icon'
import Modal from '@/core/components/customer/room/Modal'
import ModalButton from '@/core/components/customer/room/ModalButton'
import BackgoundList from '@/core/components/customer/room/tools/Background/BackgroundList'
import React from 'react'

const BackgroundButton: React.FC = () => {
  return (
    <Modal>
      <Modal.Open opens='BackgoundList'>
        <ModalButton
          icon={<Icon name='MultiImage' />}
          tooltip='Set Backgound'
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Modal.Open>
      <Modal.Window name='BackgoundList'>
        <BackgoundList />
      </Modal.Window>
    </Modal>
  )
}

export default BackgroundButton
