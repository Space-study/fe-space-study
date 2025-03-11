'use client'

import type React from 'react'

import {Upload, X} from 'lucide-react'
import Image from 'next/image'
import {useRef} from 'react'
import {Button} from '../ui/button'

interface ImageUploadProps {
  onImageChange: (file: File | null) => void
  previewUrl: string | null
  setPreviewUrl: (url: string | null) => void
}

export function ImageUpload({onImageChange, previewUrl, setPreviewUrl}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      onImageChange(file)
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      onImageChange(null)
      setPreviewUrl(null)
    }
  }

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageChange(null)
    setPreviewUrl(null)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Button type='button' variant='outline' onClick={() => fileInputRef.current?.click()}>
          <Upload className='h-4 w-4 mr-2' />
          Upload Image
        </Button>
        {previewUrl && (
          <Button
            type='button'
            variant='outline'
            onClick={handleRemoveImage}
            className='text-destructive'>
            <X className='h-4 w-4 mr-2' />
            Remove
          </Button>
        )}
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          accept='image/*'
          className='hidden'
        />
      </div>

      {previewUrl && (
        <div className='relative aspect-video w-full max-w-md border rounded-md overflow-hidden'>
          <Image
            src={previewUrl || '/placeholder.svg'}
            alt='Preview'
            fill
            className='object-cover'
          />
        </div>
      )}

      {!previewUrl && (
        <div className='border border-dashed rounded-md p-8 text-center text-muted-foreground'>
          No image selected
        </div>
      )}
    </div>
  )
}
