'use client'

import {BlogCard} from '@/core/components/blog/blog-card'
import {CategoryNav} from '@/core/components/blog/category-nav'
import {useUser} from '@src/app/shared/UserProvider'
import {BlogService} from '@src/core/services/blog/blog-service'
import {useEffect, useState} from 'react'

export default function Page() {
  // interface Blog {
  //   title: string;
  //   category: string;
  //   author: string;
  //   thumbnail_path: string;
  //   blog_id: number;
  // }
  const {user} = useUser()

  type Blog = {
    title: string
    category: string
    author_id: number
    thumbnail_path: string
    blog_id: number
    firstname: string
    lastname: string
  }

  const [blogs, setBlogs] = useState<Blog[]>([])
  const blogService = new BlogService()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogService.getAllBlogs()
        const userBlogs = response.data?.filter(blog => blog.author_id === user?.id) || []
        setBlogs(userBlogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }

    fetchBlogs()
  }, [user?.id])

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='px-4 py-8'>
          <h1 className='text-3xl font-bold text-center mb-6'>MY BLOGS</h1>
          <CategoryNav />
        </div>
      </header>

      <div className='px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
          {blogs.map((post, index) => (
            <BlogCard
              key={index}
              title={post?.title}
              category={post?.category}
              imageUrl={post.thumbnail_path}
              blog_id={post.blog_id}
              lastname={post.lastname}
              firstname={post.firstname}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
