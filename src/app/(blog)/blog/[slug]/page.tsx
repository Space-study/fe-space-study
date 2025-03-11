import type {BlogPosts} from '@/core/types/blog'
import Image from 'next/image'
import {notFound} from 'next/navigation'

// This would typically come from a CMS or API
const blogPosts: BlogPosts = {
  'stress-and-anxiety': {
    title: '10 Highly Effective Ways To Relieve Stress And Anxiety',
    category: 'STRESS & ANXIETY',
    author: 'ANGELA LOY',
    imageUrl: '/placeholder.svg?height=400&width=600',
    content: `Feeling overwhelmed by stress and anxiety? You're definitely not alone. In our fast-paced, modern world, chronic stress and anxiety have become widespread issues impacting mental and physical health. However, there are proven strategies you can implement to effectively manage and reduce stress and anxiety levels. Here are 10 highly effective ways to relieve stress and anxiety:

1. Make Regular Exercise a Priority

Regular physical activity is one of the most effective ways to combat stress and anxiety. Exercise releases endorphins, which are natural mood elevators, and helps to:
- Reduce stress hormones
- Improve sleep quality
- Boost self-confidence
- Enhance overall well-being

2. Practice Mindfulness and Meditation

3. Maintain a Healthy Sleep Schedule

4. Establish a Balanced Diet

5. Try Deep Breathing Exercises

6. Set Boundaries and Learn to Say No

7. Connect with Supportive People

8. Engage in Creative Activities

9. Spend Time in Nature

10. Seek Professional Help When Needed`,
  },
}

// Type guard to check if a slug exists in blogPosts
function isBlogSlug(slug: string): slug is keyof typeof blogPosts & string {
  return slug in blogPosts
}

export default async function BlogPost({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params

  if (!isBlogSlug(slug)) {
    notFound()
  }

  const post = blogPosts[slug]

  return (
    <article className='min-h-screen bg-white'>
      <header className='max-w-4xl mx-auto px-4 pt-12 pb-8'>
        <div className='text-sm text-rose-500 mb-4 tracking-wide'>{post.category}</div>
        <h1 className='text-4xl md:text-5xl font-bold text-center mb-6'>{post.title}</h1>
        <div className='text-center text-sm tracking-wider text-gray-600 mb-8'>{post.author}</div>
      </header>

      <div className='max-w-4xl mx-auto px-4 mb-12'>
        <div className='relative aspect-[16/9] mb-12'>
          <Image
            src={post.imageUrl || '/placeholder.svg'}
            alt={post.title}
            fill
            className='object-cover rounded-lg'
            priority
          />
        </div>

        <div className='prose prose-lg max-w-none'>
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('#')) {
              return (
                <h2 key={index} className='text-2xl font-bold mt-8 mb-4'>
                  {paragraph.replace('# ', '')}
                </h2>
              )
            }

            if (paragraph.includes('- ')) {
              return (
                <ul key={index} className='list-disc pl-6 my-4'>
                  {paragraph.split('\n').map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              )
            }

            return (
              <p key={index} className='mb-6 leading-relaxed'>
                {paragraph}
              </p>
            )
          })}
        </div>
      </div>
    </article>
  )
}
