'use client'

import {Music, musicService} from '@/core/services/room/music-service'
import {Button} from '@src/core/components/ui/button'
import {PlusCircle} from 'lucide-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {MusicList} from './music-list'

export default function MusicPage() {
  const [music, setMusic] = useState<Music[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMusic = async () => {
    try {
      setIsLoading(true)
      const data = await musicService.getAllMusic()
      console.log('Fetched music:', data)
      setMusic(data)
    } catch (error) {
      console.error('Fetch music error:', error)
      toast.error('Failed to fetch music')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMusic()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting music ID:', id)
      await musicService.deleteMusic(id)
      setMusic(music.filter(item => item.id !== id))
      toast.success('Music deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete music')
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Music Collection</h1>
        <Link href='/music/create'>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add New Music
          </Button>
        </Link>
      </div>
      <MusicList music={music} isLoading={isLoading} onDelete={handleDelete} />
    </div>
  )
}
