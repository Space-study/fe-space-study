'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@src/core/components/ui/card'
import { Button } from '@src/core/components/ui/button'
import { Input } from '@src/core/components/ui/input'
import { Pencil, Trash } from 'lucide-react'

const sampleBlogs = [
  {
    id: 1,
    title: '10 Tips for Effective Remote Work',
    author: 'John Doe',
    status: 'Published',
    date: '2025-01-01',
  },
  {
    id: 2,
    title: 'How to Stay Productive During the Holidays',
    author: 'Jane Smith',
    status: 'Draft',
    date: '2025-01-10',
  },
  {
    id: 3,
    title: 'The Future of AI in Education',
    author: 'Alice Brown',
    status: 'Draft',
    date: '2025-01-15',
  },
  {
    id: 4,
    title: '10 Tips for Effective Remote Work',
    author: 'John Doe',
    status: 'Published',
    date: '2025-01-01',
  },
  {
    id: 5,
    title: 'How to Stay Productive During the Holidays',
    author: 'Jane Smith',
    status: 'Draft',
    date: '2025-01-10',
  },
  {
    id: 6,
    title: 'The Future of AI in Education',
    author: 'Alice Brown',
    status: 'Draft',
    date: '2025-01-15',
  },
]

export default function ManageBlog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [blogs, setBlogs] = useState(sampleBlogs)

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this blog?')
    if (confirmDelete) {
      setBlogs(blogs.filter((blog) => blog.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id
          ? {
              ...blog,
              status: blog.status === 'Published' ? 'Draft' : 'Published',
            }
          : blog
      )
    )
  }

  return (
    <div className="p-4 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Blog</h1>
        <Button variant="default" onClick={() => alert('Add New Blog')}>
          Add Blog
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search blogs..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Author: {blog.author}</p>
              <p>Date: {blog.date}</p>
              <p>Status: {blog.status}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => alert(`Edit blog: ${blog.title}`)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleStatus(blog.id)}
                className={blog.status === 'Published' ? 'text-green-600' : 'text-gray-600'}
              >
                {blog.status === 'Published' ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(blog.id)}
                className="text-red-600"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Footer */}
      {filteredBlogs.length === 0 && (
        <div className="text-center text-muted-foreground mt-6">No blogs found.</div>
      )}
    </div>
  )
}
