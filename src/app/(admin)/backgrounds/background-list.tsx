'use client'

import {format} from 'date-fns'
import {Edit, Search, Trash2} from 'lucide-react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'

import {type Background, backgroundService} from '@/core/services/room/background-service'
import {Button} from '@src/core/components/ui/button'
import {Card, CardContent, CardFooter} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'

export function BackgroundList() {
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const data = await backgroundService.getAllBackgrounds()
        setBackgrounds(data)
      } catch (error) {
        alert(error)
        toast.error('Failed to load backgrounds')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBackgrounds()
  }, [])

  // Filter backgrounds based on search term
  const filteredBackgrounds = backgrounds.filter(
    background =>
      background.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      background.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Delete background
  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this background? This action cannot be undone.',
    )
    if (!isConfirmed) return

    try {
      await backgroundService.deleteBackground(id)
      setBackgrounds(backgrounds.filter(bg => bg.background_id !== id))
      toast.success('Background deleted successfully')
    } catch (error) {
      alert(error)
      toast.error('Failed to delete background')
    }
  }

  const getImageSrc = (thumbnailPath?: string) => {
    if (!thumbnailPath) return '/placeholder.svg'
    if (/^https?:\/\//.test(thumbnailPath)) return thumbnailPath
    return thumbnailPath.startsWith('/') ? thumbnailPath : `/${thumbnailPath}`
  }

  return (
    <div className='space-y-6'>
      <div className='relative'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search backgrounds...'
          className='pl-8'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p>Loading backgrounds...</p>
      ) : filteredBackgrounds.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <p className='text-muted-foreground'>No backgrounds found</p>
          {searchTerm && (
            <Button variant='link' onClick={() => setSearchTerm('')} className='mt-2'>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredBackgrounds.map(background => (
            <Card key={background.background_id} className='overflow-hidden'>
              <div className='aspect-video relative'>
                <Image
                  src={getImageSrc(background.thumbnail_path)}
                  alt={background.title}
                  fill
                  className='object-cover'
                />
              </div>
              <CardContent className='p-4'>
                <h3 className='font-semibold truncate'>{background.title}</h3>
                {background.description && (
                  <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>
                    {background.description}
                  </p>
                )}
                <p className='text-xs text-muted-foreground mt-2'>
                  Created: {format(new Date(background.created_at), 'PPP')}
                </p>
              </CardContent>
              <CardFooter className='p-4 pt-0 flex justify-between'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => router.push(`/backgrounds/${background.background_id}`)}>
                  <Edit className='h-4 w-4 mr-2' />
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleDelete(background.background_id)}>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
