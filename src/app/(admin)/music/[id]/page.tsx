'use client'

import {Music, musicService} from '@/core/services/room/music-service'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {toast, Toaster} from 'react-hot-toast'
import {MusicForm} from '../music-form'

interface MusicPageProps {
  params: Promise<{id: string}>
}

export default function EditMusicPage({params}: MusicPageProps) {
  const router = useRouter()
  const [music, setMusic] = useState<Music | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paramId, setParamId] = useState<string | null>(null)

  useEffect(() => {
    params.then(({id}) => {
      setParamId(id)
    })
  }, [params])

  useEffect(() => {
    if (!paramId) return

    const id = Number.parseInt(paramId)
    if (isNaN(id)) {
      return
    }

    const fetchMusic = async () => {
      try {
        const data = await musicService.getMusicById(Number(id))
        setMusic(data)
      } catch (error) {
        console.error('Fetch music error:', error)
        toast.error('Failed to fetch music')
        router.push('/admin/music')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMusic()
  }, [paramId])

  if (isLoading) return <div>Loading...</div>
  if (!music) return <div>No music found</div>

  return (
    <div className='container mx-auto p-4'>
      <Toaster position='top-right' />
      <h1 className='text-2xl font-bold mb-4'>Edit Music: {music.title}</h1>
      <MusicForm initialData={music} />
    </div>
  )
}
