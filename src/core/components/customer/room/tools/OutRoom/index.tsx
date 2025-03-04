import Icon from '@/core/components/customer/room/Icon'
import ModalButton from '@/core/components/customer/room/ModalButton'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

const OutRoom: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true) // Ensure the component is mounted on the client
  }, [])

  const handleOutRoom = () => {
    const confirmLeave = window.confirm('Are you sure you want to leave the room?')
    if (confirmLeave) {
      localStorage.removeItem('authToken')
      router.push('/')
    }
  }

  if (!isMounted) return null // Don't render anything during SSR

  return (
    <ModalButton
      onClick={handleOutRoom}
      icon={<Icon name='DoorExit' />}
      tooltip='Leave Room'
      className='p-2 hover:bg-gray-700 transition-all'
    />
  )
}

export default OutRoom
