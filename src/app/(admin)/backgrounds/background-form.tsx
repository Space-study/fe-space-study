'use client'

import {Upload} from 'lucide-react'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'

import {type Background, backgroundService} from '@/core/services/room/background-service'
import {useUser} from '@src/app/shared/UserProvider'
import {Button} from '@src/core/components/ui/button'
import {Card} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {Label} from '@src/core/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/core/components/ui/select'
import {Textarea} from '@src/core/components/ui/textarea'

interface BackgroundFormProps {
  background?: Background
}

export function BackgroundForm({background}: BackgroundFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {user} = useUser()

  const [formData, setFormData] = useState<{
    title: string
    description: string
    category_id: number
    file: File | null
  }>(() => ({
    title: background?.title || '',
    description: background?.description || '',
    category_id: background?.category_id ?? 0,
    file: null,
  }))

  const [previewUrl, setPreviewUrl] = useState<string | null>(background?.thumbnail_path || null)

  const getImageSrc = (path?: string | null) => {
    if (!path) return '/placeholder.svg'
    if (/^(https?:\/\/|blob:)/.test(path)) return path
    return path.startsWith('/') ? path : `/${path}`
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({...prev, file}))

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title) throw new Error('Title is required')
      if (!formData.category_id) throw new Error('Please select a category')

      if (background) {
        // **UPDATE Background**: No `user_create_id`
        await backgroundService.updateBackground(background.background_id, {
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id,
          file: formData.file ?? undefined,
        })

        toast.success('Background updated successfully')
      } else {
        if (!formData.file) throw new Error('Please select a file')
        if (!user?.id) throw new Error('User is not authenticated')

        // **CREATE Background**: Include `user_create_id`
        await backgroundService.createBackground({
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id,
          file: formData.file,
          user_create_id: user.id,
        })

        toast.success('Background created successfully')
      }

      router.push('/backgrounds')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save background')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Card className='p-6'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            rows={4}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <Select
            value={formData.category_id.toString()}
            onValueChange={value => setFormData({...formData, category_id: Number(value)})}>
            <SelectTrigger id='category'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>Nature</SelectItem>
              <SelectItem value='2'>Abstract</SelectItem>
              <SelectItem value='3'>Cityscape</SelectItem>
              <SelectItem value='4'>Texture</SelectItem>
              <SelectItem value='5'>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='file'>Background Image</Label>
          <div className='flex items-center gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => document.getElementById('file')?.click()}
              className='w-full'>
              <Upload className='mr-2 h-4 w-4' />
              {background ? 'Change Image' : 'Upload Image'}
            </Button>
            <Input
              id='file'
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
              required={!background}
            />
          </div>
        </div>

        {previewUrl && (
          <div className='rounded-md overflow-hidden border'>
            <div className='aspect-video relative'>
              <Image src={getImageSrc(previewUrl)} alt='Preview' fill className='object-cover' />
            </div>
          </div>
        )}

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/backgrounds')}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : background ? 'Update Background' : 'Create Background'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
