import Image from 'next/image'
import Link from 'next/link'

interface BlogCardProps {
  title: string
  category: string
  imageUrl: string
  blog_id: number
  firstname: string
  lastname: string
}

export function BlogCard({title, category, imageUrl, blog_id, firstname, lastname}: BlogCardProps) {
  return (
    <Link href={`/blog/${blog_id}`} className='block'>
      <article className='rounded-lg overflow-hidden group bg-white shadow-sm hover:shadow-md transition-shadow'>
        <div className='relative aspect-[4/3] overflow-hidden'>
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            fill
            className='object-cover transition-transform group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
        </div>
        <div className='p-4'>
          <div className='text-sm text-rose-500 mb-2'>{category}</div>
          <h3 className='text-lg font-semibold mb-2 line-clamp-2'>{title}</h3>
          <p className='text-sm text-gray-600'>
            {firstname} {lastname}
          </p>
        </div>
      </article>
    </Link>
  )
}
