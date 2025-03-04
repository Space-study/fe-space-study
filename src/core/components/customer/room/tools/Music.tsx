import {MovableCard} from '@/core/components/common/MovableCard'
import Image from 'next/image'
import React, {useState} from 'react'
import {FaVolumeMute, FaVolumeUp} from 'react-icons/fa'

interface MusicProps {
  visible: boolean
  toggleCard: () => void
}

export const Music: React.FC<MusicProps> = ({visible, toggleCard}) => {
  const ambianceOptions = [
    {
      label: 'Delta Waves',
      icon: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      label: 'Theta Waves',
      icon: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      label: 'Rain',
      icon: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      label: 'Cafe',
      icon: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      label: 'Fireplace',
      icon: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      label: 'Lava',
      icon: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
  ]

  const [volumeLevels, setVolumeLevels] = useState<number[]>(Array(ambianceOptions.length).fill(0))
  const [mainVolume, setMainVolume] = useState(0)
  const [youtubeVolume, setYoutubeVolume] = useState(0)

  const handleVolumeChange = (index: number, value: number) => {
    const updatedVolumes = [...volumeLevels]
    updatedVolumes[index] = value
    setVolumeLevels(updatedVolumes)
  }

  const handleMainVolumeChange = (value: number) => {
    setMainVolume(value)
    // If the master volume is set to 0 (mute), mute all the ambiance options
    if (value === 0) {
      setVolumeLevels(Array(ambianceOptions.length).fill(0))
      setYoutubeVolume(0)
    }
  }

  const handleYoutubeVolumeChange = (value: number) => {
    setYoutubeVolume(value)
  }
  return (
    <MovableCard visible={visible} className='music' toggleCard={toggleCard}>
      <h1 className='text-neutral-200 dark:text-neutral-900 font-title text-lg'>Soundboard</h1>

      {/* Master Volume Section */}
      <div>
        <h2 className='text-neutral-200 dark:text-neutral-900 font-semibold mb-2 mt-2'>
          Master Volume
        </h2>
        <div className='flex items-center gap-4'>
          {mainVolume === 0 ? (
            <FaVolumeMute className='text-neutral-400 dark:text-neutral-600' />
          ) : (
            <FaVolumeUp className='text-neutral-400 dark:text-neutral-600' />
          )}
          <input
            type='range'
            className='w-full accent-blue-500 dark:accent-blue-400'
            value={mainVolume}
            onChange={e => handleMainVolumeChange(parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* YouTube Link Section */}
      <div>
        <h2 className='text-neutral-200 dark:text-neutral-900 font-semibold mb-2 mt-3'>
          YouTube Link
        </h2>
        <div className='flex items-center gap-4'>
          <input
            type='text'
            className='border border-neutral-600 dark:border-neutral-300 rounded-md w-full px-3 py-2 text-neutral-700 dark:text-neutral-200'
            defaultValue='https://youtu.be/jfKfPfyJRdk'
          />
        </div>
        <div className='flex items-center gap-4 mt-6'>
          {youtubeVolume === 0 ? (
            <FaVolumeMute className='text-neutral-400 dark:text-neutral-600' />
          ) : (
            <FaVolumeUp className='text-neutral-400 dark:text-neutral-600' />
          )}
          <input
            type='range'
            className='w-full accent-blue-500 dark:accent-blue-400'
            value={mainVolume}
            onChange={e => handleYoutubeVolumeChange(parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* Ambiance Section with Scroll */}
      <div>
        <h2 className='text-neutral-200 dark:text-neutral-900 font-semibold mb-2 mt-3'>Ambiance</h2>
        <ul className='flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2'>
          {ambianceOptions.map((item, index) => (
            <li key={index} className='flex flex-col gap-2'>
              <div className='flex items-center gap-4'>
                <div className='w-6 h-6 relative'>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={100}
                    height={100}
                    style={{objectFit: 'cover'}}
                  />
                </div>
                <span className='text-neutral-200 dark:text-neutral-900'>{item.label}</span>
              </div>
              <div className='flex items-center gap-4'>
                {volumeLevels[index] > 0 ? (
                  <FaVolumeUp className='text-neutral-400 dark:text-neutral-600' />
                ) : (
                  <FaVolumeMute className='text-neutral-400 dark:text-neutral-600' />
                )}
                <input
                  type='range'
                  className='w-full accent-blue-500 dark:accent-blue-400'
                  value={volumeLevels[index]}
                  onChange={e => handleVolumeChange(index, parseInt(e.target.value))}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MovableCard>
  )
}
