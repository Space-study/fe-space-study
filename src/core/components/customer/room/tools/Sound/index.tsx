import {useEffect, useState} from 'react'
import SoundItem from './SoundItem'
type Sound = {
  id: string
  name: string
  volume: number
  muted: boolean
  audio: HTMLAudioElement
}

type VolumeSettingsProps = {
  minimized: boolean
}

export default function VolumeSettings({minimized}: VolumeSettingsProps) {
  const [sounds, setSounds] = useState<Sound[]>([])

  useEffect(() => {
    // Initialize sounds with audio
    const initialSounds: Sound[] = [
      {id: '1', name: 'Rain', volume: 0.5, muted: false, audio: new Audio('/Sound/rain.mp3')},
      {id: '2', name: 'Bird', volume: 0.3, muted: false, audio: new Audio('/Sound/bird.mp3')},
      {id: '3', name: 'Fire', volume: 0.7, muted: false, audio: new Audio('/Sound/fire.mp3')},
    ]

    initialSounds.forEach(sound => {
      sound.audio.loop = true
      sound.audio.volume = sound.volume
    })

    setSounds(initialSounds)

    // Cleanup function to pause all sounds when component unmounts
    return () => {
      initialSounds.forEach(sound => sound.audio.pause())
    }
  }, [])

  const handleToggleMute = (soundId: string) => {
    setSounds(prevSounds =>
      prevSounds.map(sound => {
        if (sound.id === soundId) {
          const newMuted = !sound.muted
          sound.audio.muted = newMuted
          if (newMuted) {
            sound.audio.pause()
          } else {
            sound.audio.play()
          }
          return {...sound, muted: newMuted}
        }
        return sound
      }),
    )
  }

  const handleVolumeChange = (soundId: string, newVolume: number) => {
    setSounds(prevSounds =>
      prevSounds.map(sound => {
        if (sound.id === soundId) {
          sound.audio.volume = newVolume
          const newMuted = newVolume === 0
          sound.audio.muted = newMuted
          if (newMuted) {
            sound.audio.pause()
          } else if (sound.muted) {
            sound.audio.play()
          }
          return {...sound, volume: newVolume, muted: newMuted}
        }
        return sound
      }),
    )
  }

  if (minimized) {
    return null
  }

  return (
    <div className='space-y-4 px-5 overflow-y-auto h-[30vh]'>
      <h2 className='text-xl my-3 text-white'>🌧 Sound Settings 🌳</h2>
      {sounds.map(sound => (
        <SoundItem
          key={sound.id}
          sound={sound}
          handleVolumeChange={handleVolumeChange}
          handleToggleMute={handleToggleMute}
        />
      ))}
    </div>
  )
}
