import Image from 'next/image'
import React, {useState} from 'react'
import toast from 'react-hot-toast'

interface BackgoundItemProps {
  name: string
  image: string
  isCustom: boolean
  onSelectBackgound: (name: string, image: string) => void
  onDeleteBackgound: (name: string) => void
}

const BackgoundItem: React.FC<BackgoundItemProps> = ({
  name,
  image,
  isCustom,
  onSelectBackgound,
  onDeleteBackgound,
}) => {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    onSelectBackgound(name, image)
    setIsSelected(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteBackgound(name)
    toast.success('Deleted Backgound successfully!')
  }

  return (
    <li
      className={`relative cursor-pointer m-2 text-center transition-all duration-100 ease-in-out rounded-sm border ${
        isSelected
          ? 'border-blue-900 bg-blue-500 shadow-lg'
          : 'border-slate-100 border-2 hover:shadow-3xl'
      }`}
      onClick={handleClick}>
      <Image
        src={image}
        alt={name}
        width={192}
        height={112}
        layout='intrinsic'
        className='p-1 rounded-md'
      />
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
