'use client'

import {Music} from '@/core/services/room/music-service'
import {Button} from '@src/core/components/ui/button'
import {Card, CardContent} from '@src/core/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/core/components/ui/dropdown-menu'
import {Skeleton} from '@src/core/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@src/core/components/ui/table'
import {Edit, MoreHorizontal, MusicIcon, Play, Trash2} from 'lucide-react'
import Link from 'next/link'
import {useState} from 'react'

interface MusicListProps {
  music: Music[]
  isLoading: boolean
  onDelete: (id: number) => void
}

export function MusicList({music, isLoading, onDelete}: MusicListProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDeleteClick = (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this music track? This action cannot be undone.',
      )
    ) {
      onDelete(id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handlePreview = (path: string) => {
    setPreviewUrl(previewUrl === path ? null : path)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className='p-6'>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className='flex items-center space-x-4 mb-4'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[200px]' />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (music.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-12 text-center'>
        <MusicIcon className='h-12 w-12 text-muted-foreground mb-4' />
        <h3 className='text-lg font-medium'>No music found</h3>
        <p className='text-sm text-muted-foreground mt-2'>
          Get started by adding a new music track.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User Create ID</TableHead>
              <TableHead>Category ID</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {music.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.user_create_id}</TableCell>
                <TableCell>{item.category_id || 'N/A'}</TableCell>
                <TableCell>{item.path}</TableCell>
                <TableCell className='font-medium'>{item.title}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <Button variant='ghost' size='sm' onClick={() => handlePreview(item.path)}>
                    <Play className='h-4 w-4' />
                  </Button>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <Link href={`/music/${item.id}`} prefetch={false}>
                        <DropdownMenuItem>
                          <Edit className='mr-2 h-4 w-4' />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className='text-destructive focus:text-destructive'
                        onClick={() => handleDeleteClick(item.id)}>
                        <Trash2 className='mr-2 h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {previewUrl && (
        <div className='mt-4'>
          <audio controls src={previewUrl} className='w-full max-w-md'>
            Your browser does not support the audio element.
          </audio>
          <Button variant='outline' onClick={() => setPreviewUrl(null)} className='mt-2'>
            Close Preview
          </Button>
        </div>
      )}
    </div>
  )
}
