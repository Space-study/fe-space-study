import BackgoundItem from '@/core/components/customer/room/tools/Background/BackgroundItem'
import {setBackground} from '@/core/redux/slices/backgroundSlice'
import Image from 'next/image'
import React, {useState} from 'react'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'

interface BackgoundListProps {
  onCloseModal?: () => void
}

interface Background {
  name: string
  image: string
  isCustom: boolean
}

const BackgoundList: React.FC<BackgoundListProps> = ({}) => {
  const [BackgoundListData, setBackgoundListData] = useState<Background[]>([])
  const dispatch = useDispatch()
  const handleAddBackgound = (imageUrl: string) => {
    const newBackgound = {
      name: `Backgound ${BackgoundListData.length + 1}`,
      image: imageUrl,
      isCustom: true,
    }
    setBackgoundListData([...BackgoundListData, newBackgound])
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        handleAddBackgound(reader.result as string)
        toast.success('Added Backgound successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSelectBackgound = (name: string, image: string) => {
    dispatch(setBackground(image)) // Dispatch action to update the background
    toast.success(`Selected ${name} as background!`)
  }

  const handleDeleteBackgound = (name: string) => {
    setBackgoundListData(BackgoundListData.filter(Backgound => Backgound.name !== name))
  }

  return (
    <ul className='flex gap-2 flex-wrap overflow-y-auto max-h-[75vh] scroll-smooth items-center justify-center mt-6'>
      {BackgoundListData.map(Backgound => (
        <BackgoundItem
          key={Backgound.name}
          name={Backgound.name}
          image={Backgound.image}
          isCustom={Backgound.isCustom}
          onSelectBackgound={handleSelectBackgound}
          onDeleteBackgound={handleDeleteBackgound}
        />
      ))}
      <li className='cursor-pointer m-2 text-center transition-all duration-500 ease-in-out rounded-sm border'>
        <label className='cursor-pointer relative top-1'>
          <div className='relative h-[7rem] w-[12rem] p-1'>
            <Image
              src='/default.jpg'
              alt='Add image'
              layout='fill'
              objectFit='cover'
              style={{borderRadius: '0.5rem'}}
            />
          </div>
          <p className='text-sm pb-3 text-white'>Add image</p>
          <input type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
        </label>
      </li>
    </ul>
  )
}

export default BackgoundList
