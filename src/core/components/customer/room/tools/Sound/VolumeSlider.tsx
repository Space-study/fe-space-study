import Volume from './Volume'

type VolumeSliderProps = {
  soundId: string
  volume: number
  onVolumeChange: (soundId: string, newVolume: number) => void
}

function VolumeSlider({soundId, volume, onVolumeChange}: VolumeSliderProps) {
  const maxSetting = 10
  const currentVolumeIndex = Math.round(volume * maxSetting)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    let newVolume = Math.min(Math.max(clickPosition / rect.width, 0), 1)
    onVolumeChange(soundId, newVolume)

    const handleMouseMove = (e: MouseEvent) => {
      const newClickPosition = e.clientX - rect.left
      newVolume = Math.min(Math.max(newClickPosition / rect.width, 0), 1)
      onVolumeChange(soundId, newVolume)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className='flex gap-1 cursor-pointer' onMouseDown={handleMouseDown}>
      {Array.from({length: maxSetting}, (_, index) => (
        <Volume key={index} isActive={index < currentVolumeIndex} isMuted={volume === 0} />
      ))}
    </div>
  )
}

export default VolumeSlider
