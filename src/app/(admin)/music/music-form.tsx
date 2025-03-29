'use client'

import {Music, musicService} from '@/core/services/room/music-service'
import {useUser} from '@src/app/shared/UserProvider'
import {Button} from '@src/core/components/ui/button'
import {Input} from '@src/core/components/ui/input'
import {Label} from '@src/core/components/ui/label'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'react-hot-toast'

interface MusicFormData {
  title: string
  category_id: string | number
  file?: FileList
  url?: string
  user_create_id: number
}

interface MusicFormProps {
  initialData?: Music
}

export function MusicForm({initialData}: MusicFormProps) {
  const router = useRouter()
  const {user} = useUser()
  const [previewURL, setPreviewURL] = useState<string | null>(initialData?.path || null)
  const [newFileSelected, setNewFileSelected] = useState(false) // Track if a new file is uploaded

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<MusicFormData>({
    defaultValues: {
      title: initialData?.title || '',
      category_id: initialData?.category_id || '',
      url: initialData?.path || '',
      user_create_id: user?.id || 0,
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPreviewURL(URL.createObjectURL(file))
      setNewFileSelected(true)
    } else {
      setNewFileSelected(false)
    }
  }

  const onSubmit = async (data: MusicFormData) => {
    try {
      if (initialData) {
        if (newFileSelected && data.file?.[0]) {
          // If a new file is uploaded, use FormData
          const formData = new FormData()
          formData.append('title', data.title)
          formData.append('category_id', String(data.category_id || ''))
          formData.append('user_create_id', String(user?.id || 0))
          formData.append('file', data.file[0]) // New file upload

          await musicService.updateMusicWithFile(initialData.id, formData)
        } else {
          // Otherwise, update using a plain object
          await musicService.updateMusic(initialData.id, {
            title: data.title,
            category_id: Number(data.category_id),
            path: initialData.path, // Keep old file if no new file is uploaded
            user_create_id: Number(user?.id) || 0,
          })
        }
        toast.success('Music updated successfully')
      } else {
        // Create new music with file upload
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('category_id', String(data.category_id || ''))
        formData.append('user_create_id', String(user?.id || 0))
        if (data.file?.[0]) {
          formData.append('file', data.file[0])
        }

        await musicService.createMusicWithFile(formData)
        toast.success('Music created successfully')
      }

      router.push('/music')
    } catch (error) {
      console.error('Error saving music:', error)
      toast.error(`Failed to ${initialData ? 'update' : 'create'} music`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <Label htmlFor='title' className='block text-sm font-medium mb-1'>
          Title
        </Label>
        <Input
          id='title'
          type='text'
          placeholder='Enter music title'
          {...register('title', {required: 'Title is required'})}
          className='w-full'
        />
        {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor='category_id' className='block text-sm font-medium mb-1'>
          Category ID
        </Label>
        <Input
          id='category_id'
          type='number'
          placeholder='Enter category ID (optional)'
          {...register('category_id')}
          className='w-full'
        />
      </div>

      <div>
        <Label htmlFor='file' className='block text-sm font-medium mb-1'>
          Music File Upload
        </Label>
        <Input
          id='file'
          type='file'
          accept='audio/*'
          {...register('file')}
          className='w-full'
          onChange={handleFileChange}
        />
        {errors.file && <p className='text-red-500 text-sm mt-1'>{errors.file.message}</p>}
      </div>

      {/* Audio Player Preview */}
      {previewURL && (
        <div className='mt-3'>
          <Label className='block text-sm font-medium'>Current Music Preview</Label>
          <audio controls className='mt-2 w-full'>
            <source src={previewURL} type='audio/mpeg' />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <Button
        type='submit'
        disabled={isSubmitting}
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'>
        {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
      </Button>
    </form>
  )
}
