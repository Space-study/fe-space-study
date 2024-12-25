import {StaticCard} from '@/core/components/common/StaticCard'
import Image from 'next/image'
import {useState} from 'react'
import {FaBook, FaCoffee , FaHeart, FaMountain, FaRegHeart, FaSnowflake, FaTree, FaWindowMaximize, FaYinYang} from 'react-icons/fa'
import {SquareButton} from '@/core/components/common/SquareButton'


interface SpacesProps {
  id: number
  name: string
  image: string
  visible?: boolean
  toggleCard?: () => void
}

export const Spaces: React.FC<SpacesProps> = ({visible, toggleCard}) => {
  
  const iconSpaces = [
    {
      id: 1,
      name: 'snowman',
      icon: FaSnowflake
    },
    {
      id: 2,
      name: 'mountain',
      icon: FaMountain
    },
    {
      id: 3,
      name: 'tree',
      icon: FaTree
    },
    {
      id: 4,
      name: 'window',
      icon: FaWindowMaximize
    },
    {
      id: 5,
      name: 'yoga',
      icon: FaYinYang
    },
    {
      id: 6,
      name: 'coffee',
      icon: FaCoffee
    },
    {
      id: 7,
      name: 'book',
      icon: FaBook
    }
  ]
  
  const featuredSpaces: SpacesProps[] = [
    {
      id: 1,
      name: 'Retro Animation December',
      image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      id: 2,
      name: 'Narnia Winter',
      image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      id: 3,
      name: 'Winter Ambience ASMR',
      image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
    {
      id: 4,
      name: 'Cozy Coffee Shop',
      image: 'https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg',
    },
  ]

  const [favorites, setFavorites] = useState<number[]>([])

  if (!visible) return null

  const handleFavoriteToggle = (id: number) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]))
  }

  return (
    <StaticCard
      className='absolute top-0 left-20 w-[400px] h-full bg-white shadow-lg flex flex-col'
      wrapClassName='w-full h-full rounded-lg shadow p-4 flex flex-col'
      visible={visible}
      toggleCard={toggleCard}>
      {/* Header */}
      <div className='flex items-center justify-between border-b pb-2'>
        <h2 className='text-neutral-950 font-medium'>Spaces</h2>
        <button onClick={toggleCard} className='text-neutral-500 hover:text-neutral-700 transition'>
          <span className='material-symbols-outlined'>close</span>
        </button>
      </div>

      {/* Search and Tabs */}
      <div className='mt-4'>
        <input
          type='text'
          placeholder='Search space'
          className='w-full p-2 border rounded-lg text-sm'
        />
        <div className='flex mt-3 gap-4'>
          <button className='text-neutral-950 font-medium border-b-2 border-black'>
            All Spaces
          </button>
          <button className='text-neutral-500 hover:text-neutral-700 transition'>Favorites</button>
        </div>
      </div>

      {/* Categories */}
      <div className='flex mt-4 gap-3 overflow-x-auto scrollbar-hide'>
        {iconSpaces.map((iconSpace) => (
          <SquareButton
        icon={iconSpace.icon}
        onClick={() => handleFavoriteToggle(iconSpace.id)}
        key={iconSpace.id}
        className='p-2 bg-blue-100 rounded-lg flex justify-center items-center hover:bg-gray-200'>
        <span className={`material-symbols-outlined text-lg`}>{iconSpace.name}</span>
          </SquareButton>
        ))}
      </div>

      {/* Featured Spaces */}
      <div className='mt-6'>
        <h3 className='text-neutral-800 font-semibold mb-2'>Featured Spaces</h3>
        <div className='grid grid-cols-2 gap-4'>
          {featuredSpaces.map(space => (
            <div key={space.id} className='relative'>
              <Image
                src={space.image}
                alt={space.name}
                width={150}
                height={96}
                className='w-full h-24 object-cover rounded-lg'
              />
              <div className='absolute top-2 right-2'>
                <button
                  className='absolute top-2 right-2 w-[32px] h-[32px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-500 hover:text-primary-50 transition duration-300'
                  onClick={() => handleFavoriteToggle(space.id)}>
                  {favorites.includes(space.id) ? (
                    <FaHeart className='text-lg text-red-500' />
                  ) : (
                    <FaRegHeart className='text-lg text-neutral-500' />
                  )}
                </button>
              </div>
              <p className='text-sm mt-1'>{space.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Spaces */}
      <div className='mt-6'>
        <h3 className='text-neutral-800 font-semibold mb-2'>Recommended Spaces</h3>
        <div className='grid grid-cols-2 gap-4'>
          {['Nature View', 'Cozy Crackling Fire'].map((space, idx) => (
            <div key={idx} className='relative'>
              <Image
                src='https://www.dragosroua.com/wp-content/uploads/2019/03/coffee-shop-1149155_1920.jpg'
                alt={space}
                width={150}
                height={96}
                className='w-full h-24 object-cover rounded-lg'
              />
              <div className='absolute top-2 right-2'>
                <button
                  className='absolute top-2 right-2 w-[32px] h-[32px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-500 hover:text-primary-50 transition duration-300'
                  onClick={() => handleFavoriteToggle(idx)}
                >
                  {favorites.includes(idx) ? (
                  <FaHeart className='text-lg text-red-500' />
                  ) : (
                  <FaRegHeart className='text-lg text-neutral-500' />
                  )}
                </button>
              </div>
              <p className='text-sm mt-1'>{space}</p>
            </div>
          ))}
        </div>
      </div>
    </StaticCard>
  )
}
