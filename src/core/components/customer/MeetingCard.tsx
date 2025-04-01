'use client'

import {Badge} from '@/core/components/ui/badge'
import {Button} from '@/core/components/ui/button'
import {Card, CardContent, CardFooter} from '@/core/components/ui/card'
import {roomService} from '@src/core/services/user/list-room-service'
import {Heart} from 'lucide-react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useState} from 'react'

interface CardProps {
  data: {
    id: number
    image: string
    alt: string
    title: string
    category: string
    status: string
    count: number
    privacy: 'public' | 'private'
    inviteLink?: string
  }
}

const MeetingCard = ({data}: CardProps) => {
  const [favorite, setFavorite] = useState<boolean>(false)
  // const [copied, setCopied] = useState<boolean>(false)

  const router = useRouter()

  // Only render if status is active
  if (data.status !== 'active' || data.privacy !== 'public') {
    return null
  }

  // const generateShareableLink = () => {
  //   if (!data || !data.id) return ''

  //   const baseUrl = window.location.origin

  //   if (data.privacy === 'public') {
  //     return `${baseUrl}/room/${data.id}`
  //   }

  //   if (data.privacy === 'private' && data.inviteLink) {
  //     return `${baseUrl}/room/${data.id}?inviteLink=${encodeURIComponent(data.inviteLink)}`
  //   }

  //   return `${baseUrl}/room/${data.id}`
  // }

  // const shareLink = generateShareableLink()

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(shareLink)
  //   setCopied(true)
  //   setTimeout(() => setCopied(false), 2000)
  // }

  const handleFavoriteToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setFavorite(!favorite)
  }

  const handleJoinRoom = async () => {
    try {
      await roomService.joinRoom({id: data.id, userId: 123, inviteLink: data.inviteLink})
      // alert('Joined successfully!')
      router.push(`/room/${data.id}?inviteLink=${encodeURIComponent(data.inviteLink || '')}`)
    } catch (err) {
      alert(`Error: ${err}`)
    } finally {
      // Do something
    }
  }

  return (
    <Card
      className='overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer'
      onClick={handleJoinRoom}>
      <div className='relative'>
        <div className='aspect-video overflow-hidden'>
          <Image
            src={data.image || '/placeholder.svg'}
            alt={data.alt}
            width={400}
            height={225}
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>

        <Button
          variant='outline'
          size='icon'
          className='absolute top-2 right-2 h-8 w-8 rounded-full'
          onClick={handleFavoriteToggle}>
          <Heart className={`h-4 w-4 ${favorite ? 'fill-current text-red-500' : ''}`} />
        </Button>

        <div className='absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent'>
          <h3 className='text-white font-medium text-lg line-clamp-1'>{data.title}</h3>
        </div>
      </div>

      <CardContent className='p-4'>
        <Badge className='px-2.5 py-0.5'>{data.category}</Badge>
        <div className='text-muted-foreground'>{data.status}</div>
      </CardContent>

      <CardFooter className='pt-0 pb-4 px-4 flex flex-col gap-2'>
        <div className='text-sm text-muted-foreground'>Max {data.count} members</div>

        {/* {data.privacy === 'private' && data.inviteLink && (
          <div className='flex items-center space-x-2 w-full'>
            <input
              type='text'
              value={shareLink}
              readOnly
              className='px-2 py-1 border rounded-md w-full text-sm bg-gray-100'
            />
            <Button
              variant='outline'
              size='sm'
              onClick={copyToClipboard}
              className='flex items-center gap-1 text-sm'>
              <LinkIcon className='h-4 w-4' />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )} */}
      </CardFooter>
    </Card>
  )
}

export default MeetingCard
