import {BlogCard} from '@/core/components/blog/blog-card'
import {CategoryNav} from '@/core/components/blog/category-nav'

const blogPosts = [
  {
    title: '10 Highly Effective Ways to Relieve Stress and Anxiety',
    category: 'Stress & Anxiety',
    author: 'Angela Loy',
    imageUrl: '/placeholder.svg?height=400&width=600',
  },
  {
    title: "Why Self-Doubt Means You're on the Right Path: A Guide to Imposter Syndrome",
    category: 'Personal Growth',
    author: 'Emma Loft',
    imageUrl: '/placeholder.svg?height=400&width=600',
  },
  {
    title: 'From Burnout to Brilliance: How to Rekindle Your Passion for Your Work',
    category: 'Personal Growth',
    author: 'Angela Loy',
    imageUrl: '/placeholder.svg?height=400&width=600',
  },
  {
    title: 'The Case for Doing Nothing: Why Embracing Downtime is Essential for Mental Health',
    category: 'Personal Growth',
    author: 'Angela Loy',
    imageUrl: '/placeholder.svg?height=400&width=600',
  },
  {
    title: 'Batching vs. Multitasking: Which is Best for You?',
    category: 'Productivity',
    author: 'Nadia Lemay',
    imageUrl: '/placeholder.svg?height=400&width=600',
  },
  {
    title: 'How to Use the Pomodoro Technique Effectively',
    category: 'Productivity',
    author: 'Nadia Lemay',
    imageUrl: '/placeholder.svg?height=400&width=600',
  },
]

export default function Page() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm sticky top-0 z-10'>
        <div className='px-4 py-8'>
          <h1 className='text-3xl font-bold text-center mb-6'>LATEST BLOGS</h1>
          <CategoryNav />
        </div>
      </header>

      <div className='px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
          {blogPosts.map((post, index) => (
            <BlogCard
              key={index}
              title={post.title}
              category={post.category}
              author={post.author}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
