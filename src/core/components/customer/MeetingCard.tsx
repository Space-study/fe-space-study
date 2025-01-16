import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'
import {FaHeart, FaRegHeart} from 'react-icons/fa' // Import both filled and outline heart icons

interface CardProps {
  data: {
    id: number
    image: string
    alt: string
    title: string
    category: string
    status: string
    count: number
  }
}

const categoryColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-red-100 text-red-700',
  'bg-teal-100 text-teal-700',
  'bg-pink-100 text-pink-700',
]

const MeetingCard = ({data}: CardProps) => {
  const [favorite, setFavorite] = useState<boolean>(false)

  const handleFavoriteToggle = () => {
    setFavorite(!favorite) // Toggle the favorite state
  }

  const badgeColor = categoryColors[data.id % categoryColors.length]
  return (
    <div id={`meetingcard-${data.id}`}>
      <div className='w-full bg-white shadow rounded-lg p-4 flex gap-4'>
        {data && (
          <Link href='/room' className='block'>
            <div
              key={data.id}
              className='w-[260px] bg-neutral-100 rounded-md overflow-hidden relative'>
              <Image
                src={data.image}
                alt={data.alt}
                width={260}
                height={150}
                className='w-[260px] h-[150px] object-cover'
              />

              <button
                className='absolute top-2 right-2 w-[32px] h-[32px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-500 hover:text-primary-50 transition duration-300'
                onClick={handleFavoriteToggle} // Add click handler
              >
                {favorite ? (
                  <FaHeart className='text-lg text-red-500' /> // Filled heart for favorite
                ) : (
                  <FaRegHeart className='text-lg text-neutral-500' /> // Outline heart for non-favorite
                )}
              </button>
              <div className='p-4'>
                <h3 className='text-neutral-950 font-title font-semibold'>{data.title}</h3>
                <div className={`px-2 py-1 text-xs rounded-full w-fit mb-2 badge ${badgeColor}`}>
                  {data.category}
                </div>
                <div className='flex items-center gap-1 text-neutral-500'>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      data.status === 'Online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                    }`}></span>
                  <span>
                    {data.count} {data.status}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default MeetingCard
