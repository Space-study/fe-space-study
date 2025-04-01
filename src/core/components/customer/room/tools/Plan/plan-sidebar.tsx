'use client'

import {Card, CardContent, CardHeader} from '@/core/components/ui/card'
import {ScanEye} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import ProjectManagement from './ProjectManagement'
import TagManagement from './TagManagement'

export function PlanSidebar(): JSX.Element {
  const [roomId, setRoomId] = useState<number | null>(null)

  useEffect(() => {
    // Extract the room ID from the URL path
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const roomMatch = pathname.match(/\/room\/(\d+)/)
      if (roomMatch && roomMatch[1]) {
        const id = Number(roomMatch[1])
        console.log('Extracted room ID from URL:', id)
        setRoomId(id)
      } else {
        console.warn('Could not extract room ID from pathname:', pathname)
      }
    }
  }, [])

  return (
    <Card className='h-full w-64 flex flex-col bg-white shadow-md'>
      <CardHeader className='border-b'>
        <div className='flex items-center space-x-2'>
          <div className='h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center'>
            <ScanEye className='h-4 w-4 text-white' />
          </div>
          <h1 className='text-xl font-bold'>FocusHub</h1>
        </div>
      </CardHeader>
      <CardContent className='flex-1 overflow-auto space-y-6'>
        {roomId ? (
          <>
            <ProjectManagement roomId={roomId} userId={1} />
            <TagManagement />
          </>
        ) : (
          <div className='text-sm text-muted-foreground'>Loading room data...</div>
        )}
      </CardContent>
    </Card>
  )
}
