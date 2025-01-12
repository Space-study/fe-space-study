import Icon from '@/core/components/customer/room/Icon'
import ModalButton from '@/core/components/customer/room/ModalButton'
import {useEffect, useState} from 'react'

const Expand: React.FC = () => {
  const [localFullscreen, setLocalFullscreen] = useState<boolean>(false)

  const fullscreenHandler = () => {
    const elem = document.documentElement

    if (document.fullscreenElement) {
      document.exitFullscreen?.().then(() => {
        setLocalFullscreen(false)
      })
    } else {
      elem.requestFullscreen?.().then(() => {
        setLocalFullscreen(true)
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null
      setLocalFullscreen(isCurrentlyFullscreen)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const iconName = localFullscreen ? 'UnScale' : 'Scale'

  return (
    <ModalButton
      onClick={fullscreenHandler}
      icon={<Icon name={iconName} />}
      tooltip={localFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      className='p-2 hover:bg-gray-700 transition-all'
    />
  )
}

export default Expand
