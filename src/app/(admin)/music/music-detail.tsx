'use client'

import {Music, musicService} from '@/core/services/room/music-service'
import {Button} from '@src/core/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@src/core/components/ui/card'
import {Skeleton} from '@src/core/components/ui/skeleton'
import {ArrowLeft, Edit} from 'lucide-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'

export function MusicDetail({id}: {id: number}) {
  const [music, setMusic] = useState<Music | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setIsLoading(true)
        const data = await musicService.getMusicById(id)
        setMusic(data)
      } catch (error) {
        console.log(error)
        toast.error('Failed to fetch music details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMusic()
  }, [id])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-8 w-[200px]' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!music) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <p>Music not found</p>
          <Link href='/music'>
            <Button variant='link'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to list
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>{music.title}</CardTitle>
        <div className='flex space-x-2'>
          <Link href='/music'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back
            </Button>
          </Link>
          <Link href={`/music/${id}/edit`}>
            <Button size='sm'>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4'>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-1 font-medium'>ID:</div>
            <div className='col-span-3'>{music.id}</div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-1 font-medium'>Title:</div>
            <div className='col-span-3'>{music.title}</div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-1 font-medium'>Category ID:</div>
            <div className='col-span-3'>{music.category_id || 'N/A'}</div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-1 font-medium'>File Path:</div>
            <div className='col-span-3'>{music.path}</div>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            <div className='col-span-1 font-medium'>Created At:</div>
            <div className='col-span-3'>{new Date(music.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
