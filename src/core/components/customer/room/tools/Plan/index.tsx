import Icon from '@/core/components/customer/room/Icon'
import Modal from '@/core/components/customer/room/Modal'
import ModalButton from '@/core/components/customer/room/ModalButton'
import PlanPageClient from '@/core/pages/customer/PlanPageClient'
import React from 'react'

const SwitchMenuButton: React.FC = () => {
  return (
    <Modal>
      <Modal.Open opens='SwitchMenu'>
        <ModalButton
          icon={<Icon name='MultiImage' />}
          tooltip='Switch Mode'
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </Modal.Open>
      <Modal.Window name='SwitchMenu'>
        <PlanPageClient />
      </Modal.Window>
    </Modal>
  )
}

export default SwitchMenuButton
