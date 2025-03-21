'use client'

import {Avatar, AvatarFallback, AvatarImage} from '@/core/components/ui/avatar'
import {Button} from '@/core/components/ui/button'
import {Textarea} from '@/core/components/ui/textarea'
import {useUser} from '@src/app/shared/UserProvider'
import axiosInstance from '@src/lib/axiosInstance/axiosInstance'
import Image from 'next/image'
import type React from 'react'
import {useEffect, useState} from 'react'

type User = {
  id: number
  firstName: string
  lastName: string
}

type Comment = {
  comment_id: number
  blog_id: number
  comment: string
  created_at: string
  user_id: number
  user: User
}

type responseBlog = {
  title: string
  category: string
  content: string
  thumbnail_path: string
  lastname: string
  firstname: string
  comments: Comment[]
}

export default function BlogPost({params}: {params: Promise<{id: number}>}) {
  const [blog, setBlog] = useState<responseBlog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {user} = useUser()

  /** Fetch blog post and comments on component mount */
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const {id} = await params
        const blogResponse = await axiosInstance.get<responseBlog>(`/api/v1/blogs/${id}`)
        console.log('Raw content from API:', blogResponse.data.content) // Debug content
        setBlog(blogResponse.data)
        // Sắp xếp comments từ mới nhất đến cũ nhất
        const sortedComments = blogResponse.data.comments.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        setComments(sortedComments)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchBlogAndComments()
  }, [params])

  /** Handle comment submission */
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const {id} = await params
      const response = await axiosInstance.post<Comment>('/api/v1/blog-comments', {
        blog_id: Number(id),
        user_id: user?.id,
        comment: newComment,
      })

      const newCommentFromServer = {
        ...response.data,
        created_at: new Date(response.data.created_at).toISOString(),
        user: {
          id: user?.id || 0,
          firstName: user?.firstName || 'Anonymous',
          lastName: user?.lastName || '',
        },
      }
      // Thêm comment mới vào đầu danh sách (mới nhất ở trên)
      setComments(prev => [newCommentFromServer, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  /** Format datetime for comments */
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <article className='min-h-screen bg-white'>
      <header className='max-w-4xl mx-auto px-4 pt-12 pb-8'>
        <div className='text-sm text-rose-500 mb-4 tracking-wide'>{blog?.category}</div>
        <h1 className='text-4xl md:text-5xl font-bold text-center mb-6'>{blog?.title}</h1>
        <div className='text-center text-sm tracking-wider text-gray-600 mb-8'>
          {blog?.firstname} {blog?.lastname}
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 mb-12'>
        <div className='relative aspect-[16/9] mb-12'>
          <Image
            src={blog?.thumbnail_path || '/placeholder.svg?height=720&width=1280'}
            alt={blog?.title || "Blog's thumbnail"}
            fill
            className='object-cover rounded-lg'
            priority
          />
        </div>

        {/* Render content với dangerouslySetInnerHTML */}
        <div className='prose prose-lg max-w-none mb-16'>
          <div dangerouslySetInnerHTML={{__html: blog?.content || ''}} />
        </div>

        {/* Comments Section */}
        <div className='border-t pt-8 mb-16'>
          <h2 className='text-2xl font-bold mb-8'>Comments ({comments.length})</h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className='mb-12 space-y-4'>
            <div>
              <label htmlFor='comment' className='block text-sm font-medium mb-1'>
                Comment
              </label>
              <Textarea
                id='comment'
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder='Share your thoughts...'
                className='min-h-32'
                required
              />
            </div>

            <Button type='submit' className='bg-rose-500 hover:bg-rose-600' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Comment'}
            </Button>
          </form>

          {/* Comments List */}
          <div className='space-y-8'>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.comment_id} className='border-b pb-6'>
                  <div className='flex items-start gap-4'>
                    <Avatar>
                      <AvatarImage src='/default-avatar.png' />
                      <AvatarFallback className='bg-rose-100 text-rose-800'>
                        {comment.user
                          ? `${comment.user.firstName[0]}${comment.user.lastName[0]}`
                          : 'AN'}
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex-1'>
                      <div className='flex justify-between items-center mb-2'>
                        <h4 className='font-medium'>
                          {comment.user
                            ? `${comment.user.firstName} ${comment.user.lastName}`
                            : 'Anonymous'}
                        </h4>
                        <span className='text-sm text-gray-500'>
                          {formatDateTime(comment.created_at)}
                        </span>
                      </div>
                      <p className='text-gray-700'>{comment.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center py-8'>
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
        {/* Accept Blog Button */}
        <div className='text-center'>
          <Button
            className='bg-green-500 hover:bg-green-600'
            onClick={async () => {
              try {
                const {id} = await params
                await axiosInstance.patch(`/api/v1/blogs/admin/${id}`, {status: 'accepted'})
                alert('Blog accepted successfully!')
              } catch (error) {
                console.error('Failed to accept blog:', error)
                alert('Failed to accept blog.')
              }
            }}>
            Accept Blog
          </Button>
        </div>
      </div>
    </article>
  )
}
