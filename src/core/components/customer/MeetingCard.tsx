'use client'

import type React from 'react'

import {Badge} from '@/core/components/ui/badge'
import {Button} from '@/core/components/ui/button'
import {Card, CardContent, CardFooter} from '@/core/components/ui/card'
import {Heart} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {useEffect, useState} from 'react'

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

// Category color mapping using Tailwind classes
const categoryColors: Record<string, {bg: string; text: string}> = {
  Design: {bg: 'bg-blue-100', text: 'text-blue-700'},
  Development: {bg: 'bg-green-100', text: 'text-green-700'},
  Marketing: {bg: 'bg-yellow-100', text: 'text-yellow-700'},
  Business: {bg: 'bg-purple-100', text: 'text-purple-700'},
  Education: {bg: 'bg-red-100', text: 'text-red-700'},
  Technology: {bg: 'bg-teal-100', text: 'text-teal-700'},
  Health: {bg: 'bg-pink-100', text: 'text-pink-700'},
  // Default fallback
  default: {bg: 'bg-gray-100', text: 'text-gray-700'},
}

const MeetingCard = ({data}: CardProps) => {
  const [favorite, setFavorite] = useState<boolean>(false)

  const handleFavoriteToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setFavorite(!favorite)
  }

  useEffect(() => {
    console.log('data', data)
  }, [])

  // Get color or use default if category not in mapping
  const colorSet = categoryColors[data.category] || categoryColors.default

  return (
    <Card className='overflow-hidden transition-all duration-300 hover:shadow-lg group'>
      <Link
        href={`/room`}
        // href={`/room/${data.id}`}
        className='block outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-t-lg'>
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
            className={`absolute top-2 right-2 h-8 w-8 rounded-full shadow-md bg-background/90 backdrop-blur-sm border-none ${
              favorite
                ? 'text-red-500 hover:text-red-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={handleFavoriteToggle}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
          </Button>

          <div className='absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent'>
            <h3 className='text-white font-medium text-lg line-clamp-1'>{data.title}</h3>
          </div>
        </div>
      </Link>

      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          <Badge
            variant='outline'
            className={`px-2.5 py-0.5 font-medium ${colorSet.bg} ${colorSet.text}`}>
            {data.category}
          </Badge>

          <div className='flex items-center gap-1.5 text-sm'>
            <span
              className={`w-2 h-2 rounded-full ${
                data.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}
              aria-hidden='true'></span>
            <span className='text-muted-foreground'>{data.status}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-0 pb-4 px-4'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-1.5 h-4 w-4'>
            <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
            <circle cx='9' cy='7' r='4' />
            <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
            <path d='M16 3.13a4 4 0 0 1 0 7.75' />
          </svg>
          <span>Max {data.count} members</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default MeetingCard
