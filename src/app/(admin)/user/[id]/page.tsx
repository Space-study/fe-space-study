'use client'

import {Avatar, AvatarFallback, AvatarImage} from '@src/core/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import {Button} from '@src/core/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {Label} from '@src/core/components/ui/label'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import {useEffect, useState} from 'react'

interface UserProfile {
  id: number
  email: string
  provider: string
  socialId: string
  firstName: string
  lastName: string
  photo: {
    id: string
    path: string
  }
  role: {
    id: number
    name: string
  }
  status: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export default function ProfilePage() {
  const [detail, setDetail] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      const id = window.location.pathname.split('/').pop()
      try {
        const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer your_token_here`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch profile')

        const result = await response.json()
        setDetail(result)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchUserProfile()
  }, [])

  if (!detail) return <p>Loading...</p>

  return (
    <SidebarInset>
      <header className='flex h-16 items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='#'>Others</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Setting</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className='p-4'>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src={detail.photo?.path} alt='Profile Picture' />
                  <AvatarFallback>
                    {detail.firstName[0]}
                    {detail.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>
                    {detail.firstName} {detail.lastName}
                  </p>
                  <p className='text-sm text-muted-foreground'>{detail.email}</p>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='role'>Role</Label>
                <Input id='role' value={detail.role.name} disabled />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Input id='status' value={detail.status.name} disabled />
              </div>
              <div className='flex space-x-4'>
                <Button className='flex-1'>Save Changes</Button>
                <Button variant='secondary' className='flex-1'>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
