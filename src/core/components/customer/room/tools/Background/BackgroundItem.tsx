import Image from 'next/image'
import React, {useState} from 'react'

interface BackgoundItemProps {
  backgroundId?: number
  name: string
  image: string
  isCustom: boolean
  onSelectBackground: (name: string, image: string) => void
  onDeleteBackground: (name: string) => void
}

const BackgoundItem: React.FC<BackgoundItemProps> = ({
  name,
  image,
  isCustom,
  onSelectBackground,
  onDeleteBackground,
}) => {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    onSelectBackground(name, image)
    setIsSelected(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteBackground(name)
  }

  return (
    <li
      className={`relative cursor-pointer m-2 text-center transition-all duration-100 ease-in-out rounded-sm border flex flex-col justify-between p-2 ${
        isSelected
          ? 'border-blue-900 bg-blue-500 shadow-lg'
          : 'border-slate-100 border-2 hover:shadow-3xl'
      }`}
      onClick={handleClick}>
      {/* Image Wrapper for Consistent Sizing */}
      <div className='w-[192px] h-[112px] relative overflow-hidden rounded-md'>
        <Image
          src={image}
          alt={name}
          layout='fill' // Ensures image fills the wrapper
          objectFit='cover' // Keeps aspect ratio while covering the area
          objectPosition='center' // Centers image
          className='rounded-md'
        />
      </div>
      <p className='text-l pb-1 text-white'>{name}</p>
      {isCustom && (
        <button
          className='bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute top-1 right-1'
          onClick={handleDelete}>
          Delete
        </button>
      )}
    </li>
  )
}

export default BackgoundItem
