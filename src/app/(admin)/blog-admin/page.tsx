'use client'

import {BlogCardAdmin} from '@/core/components/blog/blog-card-admin'
import {BlogService} from '@src/core/services/blog/blog-service'
import {useEffect, useState} from 'react'

enum BlogStatus {
  ACCEPTED = 'accepted',
  NOT_ACCEPTED = 'not accepted',
}

type Blog = {
  title: string
  category: string
  thumbnail_path: string
  blog_id: number
  lastname: string
  firstname: string
  status: BlogStatus
}

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const blogService = new BlogService()

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await blogService.getAllBlogs()
        if (response?.data) {
          setBlogs(response.data)
        }
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError('Failed to fetch blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='px-4 py-8'>
          <h1 className='text-3xl font-bold text-center'>Manage Blogs</h1>
        </div>
      </header>

      {/* Content */}
      <main className='px-4 py-8'>
        {loading ? (
          <div className='text-center'>
            <p className='text-gray-500'>Loading blogs...</p>
          </div>
        ) : error ? (
          <div className='text-center'>
            <p className='text-red-500'>{error}</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
            {blogs.map(post => (
              <BlogCardAdmin
                key={post.blog_id}
                title={post.title}
                category={post.category}
                imageUrl={post.thumbnail_path}
                blog_id={post.blog_id}
                lastname={post.lastname}
                firstname={post.firstname}
                status={post.status}
              />
            ))}
          </div>
        ) : (
          <div className='text-center'>
            <p className='text-gray-500'>No blogs available to display.</p>
          </div>
        )}
      </main>
    </div>
  )
}
