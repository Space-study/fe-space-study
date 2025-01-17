'use client'

import {Card, CardContent, CardHeader} from '@/core/components/ui/card'
import {ScanEye} from 'lucide-react'
import React from 'react'
import ProjectManagement from './ProjectManagement'
import TagManagement from './TagManagement'

export function PlanSidebar(): JSX.Element {
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
        <ProjectManagement />
        <TagManagement />
      </CardContent>
    </Card>
  )
}
