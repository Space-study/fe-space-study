'use client'

import axiosInstance from '@src/lib/axiosInstance/axiosInstance'
import Image from 'next/image'
import {useEffect, useState} from 'react'

type responseBlog = {
  title: string
  category: string
  content: string
  thumbnail_path: string
  author_id: number
}

export default function BlogPost({params}: {params: Promise<{id: number}>}) {
  const [blog, setBlog] = useState<responseBlog | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const {id} = await params
        const response = await axiosInstance.get<responseBlog>(`/api/v1/blogs/${id}`)
        setBlog(response.data)
      } catch (error) {
        console.error('Failed to fetch blog:', error)
      }
    }

    fetchBlog()
  }, [params])

  return (
    <article className='min-h-screen bg-white'>
      <header className='max-w-4xl mx-auto px-4 pt-12 pb-8'>
        <div className='text-sm text-rose-500 mb-4 tracking-wide'>{blog?.category}</div>
        <h1 className='text-4xl md:text-5xl font-bold text-center mb-6'>{blog?.title}</h1>
        <div className='text-center text-sm tracking-wider text-gray-600 mb-8'>
          {blog?.author_id}
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 mb-12'>
        <div className='relative aspect-[16/9] mb-12'>
          <Image
            src={blog?.thumbnail_path || '/placeholder.svg'}
            alt={blog?.title || "Blog's thumbnail"}
            fill
            className='object-cover rounded-lg'
            priority
          />
        </div>

        <div className='prose prose-lg max-w-none'>
          <div dangerouslySetInnerHTML={{__html: blog?.content || ''}} />
        </div>
      </div>
    </article>
  )
}
