'use client'

import {useUser} from '@src/app/shared/UserProvider'
import axiosInstance from '@src/lib/axiosInstance/axiosInstance'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Button} from '../ui/button'
import {Card, CardContent} from '../ui/card'
import {Input} from '../ui/input'
import {Label} from '../ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'
import {ImageUpload} from './image-upload'
import {TiptapEditor} from './tiptap-editor'

export default function BlogPostForm() {
  type Blog = {
    title: string
    category_id: number
    content: string
    thumbnail_path: File | null
    author_id: number
  }

  const {user} = useUser()
  const router = useRouter()
  const {control, handleSubmit, setValue} = useForm<Blog>({
    defaultValues: {
      title: '',
      category_id: 0,
      content: '',
      thumbnail_path: null,
      author_id: 0,
    },
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setValue('author_id', user?.id ?? 0)
  }, [user, setValue])

  const onSubmit = async (data: Blog) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('content', data.content)
      formData.append('category_id', data.category_id.toString())
      formData.append('author_id', data.author_id.toString())
      if (data.thumbnail_path) {
        formData.append('file', data.thumbnail_path) // Changed 'thumbnail_path' to 'file'
      }

      const response = await axiosInstance.post('/api/v1/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('API Response:', response.data)
      alert('Blog post created successfully!')
      router.push('/blog')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to create blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Controller
              name='title'
              control={control}
              render={({field}) => (
                <Input id='title' placeholder='Enter blog post title' {...field} required />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label>Featured Image</Label>
            <Controller
              name='thumbnail_path'
              control={control}
              render={({field}) => (
                <ImageUpload
                  onImageChange={file => {
                    field.onChange(file)
                    if (file) {
                      setImagePreview(URL.createObjectURL(file))
                    } else {
                      setImagePreview(null)
                    }
                  }}
                  previewUrl={imagePreview}
                  setPreviewUrl={setImagePreview}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label>Content</Label>
            <Controller
              name='content'
              control={control}
              render={({field}) => <TiptapEditor content={field.value} onChange={field.onChange} />}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category'>Category</Label>
            <Controller
              name='category_id'
              control={control}
              render={({field}) => (
                <Select
                  value={field.value.toString()}
                  onValueChange={value => field.onChange(parseInt(value))}
                  required>
                  <SelectTrigger id='category'>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Technology</SelectItem>
                    <SelectItem value='2'>Lifestyle</SelectItem>
                    <SelectItem value='3'>Travel</SelectItem>
                    <SelectItem value='4'>Food</SelectItem>
                    <SelectItem value='5'>Health</SelectItem>
                    <SelectItem value='6'>Business</SelectItem>
                    <SelectItem value='7'>Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Blog Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
