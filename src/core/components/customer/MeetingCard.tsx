import Image from 'next/image'
import Link from 'next/link'

interface MeetingCardProps {
  image: string
  view: string
  date: string
  title: string
  description: string
  link: string
}

const MeetingCard = ({image, view, date, title, description, link}: MeetingCardProps) => {
  return (
    <div className='bg-white shadow rounded overflow-hidden'>
      <div className='relative'>
        <Image
          src={image}
          alt={title}
          width={500}
          height={192}
          className='w-full h-48 object-cover'
          layout='responsive'
          objectFit='cover'
        />
        <div className='absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded'>
          {view}
        </div>
        <div className='absolute bottom-2 right-2 bg-gray-800 text-white text-sm px-2 py-1 rounded'>
          {date}
        </div>
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-bold text-gray-800'>
          <Link href={link}>{title}</Link>
        </h3>
        <p className='text-gray-600 mt-2'>{description}</p>
      </div>
    </div>
  )
}

export default MeetingCard
