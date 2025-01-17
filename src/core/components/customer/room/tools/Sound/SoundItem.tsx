import Icon from '@/core/components/customer/room/Icon'
import VolumeSlider from './VolumeSlider'

type SoundItemProps = {
  sound: {
    id: string
    name: string
    volume: number
    muted: boolean
  }
  handleVolumeChange: (soundId: string, newVolume: number) => void
  handleToggleMute: (soundId: string) => void
}

function SoundItem({sound, handleVolumeChange, handleToggleMute}: SoundItemProps) {
  return (
    <div className='flex-1 flex items-center justify-center text-white'>
      <p className='mr-2'>{sound.name}</p>
      <button className='ml-auto mr-2' onClick={() => handleToggleMute(sound.id)}>
        {sound.volume > 0 ? (
          <Icon name='Volume' />
        ) : (
          <Icon className='filter-red-glow' name='Mute' />
        )}
      </button>
      <div className='flex items-center gap-1'>
        <VolumeSlider
          soundId={sound.id}
          volume={sound.volume}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  )
}

export default SoundItem
