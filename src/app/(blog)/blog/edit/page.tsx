'use client'

import BlogPostForm from '@/core/components/blog/blog-post-form'
import {useUser} from '@src/app/shared/UserProvider'

export default function Home() {
  const {user} = useUser()

  if (!user) {
    return <div>Unauthorized</div>
  }

  return (
    <main className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Create Edit Blog Post</h1>
      <BlogPostForm />
    </main>
  )
}
