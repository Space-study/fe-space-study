import Image from 'next/image'
import Link from 'next/link'

enum BlogStatus {
  ACCEPTED = 'accepted',
  NOT_ACCEPTED = 'not accepted',
}

interface BlogCardProps {
  title: string
  category: string
  imageUrl: string
  blog_id: number
  firstname: string
  lastname: string
  status: BlogStatus
}

export function BlogCardAdmin({
  title,
  category,
  imageUrl,
  blog_id,
  firstname,
  lastname,
  status,
}: BlogCardProps) {
  const statusStyles =
    status === BlogStatus.ACCEPTED ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'

  return (
    <Link href={`/blog-admin/${blog_id}`} className='block'>
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
          <div
            className={`text-xs font-medium rounded-full px-3 py-1 mt-3 inline-block ${statusStyles}`}>
            {status}
          </div>
        </div>
      </article>
    </Link>
  )
}
