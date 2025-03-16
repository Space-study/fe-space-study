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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/core/components/ui/select'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import {userService, UserType} from '@src/core/services/admin/user/user-service'
import {uploadPhoto} from '@src/core/services/fileUpload/fileUpload-service'
import {useEffect, useRef, useState} from 'react'

const roles = ['Admin', 'User']

export default function ProfilePage() {
  const [detail, setDetail] = useState<UserType | null>(null)
  const [initialEmail, setInitialEmail] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const userId = window.location.pathname.split('/').pop()
    if (userId) {
      userService
        .getUserById(Number(userId))
        .then(user => {
          setDetail(user)
          setInitialEmail(user.email)
        })
        .catch(error => alert(error.message))
    }
  }, [])

  const handleChange = <K extends keyof UserType>(key: K, value: UserType[K]) => {
    setDetail(prev => ({
      ...prev!,
      [key]: value ?? prev?.[key],
    }))
  }

  const handleUploadPhoto = async (file: File): Promise<string> => {
    if (file && detail) {
      try {
        const path = await uploadPhoto(file)
        handleChange('photo', {path})
        alert('Photo uploaded successfully!')
        return path
      } catch (error) {
        alert('Failed to upload photo!')
        throw error
      }
    }
    throw new Error('Invalid file or detail')
  }

  const handleSave = async () => {
    if (!detail) return
    try {
      const updatedUser = await userService.updateUserProfile(detail.id, {
        firstName: detail.firstName ?? initialEmail,
        lastName: detail.lastName ?? '',
        email: detail.email !== initialEmail ? detail.email : undefined,
        role: detail.role ?? undefined,
        status: detail.status ?? undefined,
      })
      setDetail(updatedUser)
      setInitialEmail(updatedUser.email)
      alert('Profile updated successfully!')
    } catch {
      alert('Failed to update profile!')
    }
  }

  const handleStatusUpdate = async (statusId: number) => {
    if (!detail) return
    try {
      const updatedUser = await userService.updateUserStatus(detail.id, statusId)
      setDetail(prev => ({
        ...prev!,
        status: updatedUser.status ?? prev?.status,
      }))
      alert('Status updated successfully!')
    } catch {
      alert('Failed to update status!')
    }
  }

  if (!detail) return null

  return (
    <SidebarInset>
      <header className='flex h-16 items-center gap-2 px-4'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='User'>User List</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Detail</BreadcrumbPage>
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
              {/* Avatar */}
              <div className='flex items-center space-x-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src={detail.photo?.path} alt='Profile Picture' />
                  <AvatarFallback>
                    {detail.firstName?.[0]}
                    {detail.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <input
                  type='file'
                  accept='image/*'
                  hidden
                  ref={fileInputRef}
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        const path = await handleUploadPhoto(file)

                        setDetail(prev =>
                          prev
                            ? {
                                ...prev,
                                photo: {...prev.photo, path: path || prev.photo?.path || ''},
                              }
                            : null,
                        )
                        alert('Photo uploaded successfully!')
                      } catch (error) {
                        console.error('Error uploading photo:', error)
                        alert('Failed to upload photo. Please try again.')
                      }
                    }
                  }}
                />
                <Button onClick={() => fileInputRef.current?.click()}>Upload Photo</Button>
              </div>

              <div>
                <Label>First Name</Label>
                <Input
                  value={detail?.firstName ?? ''}
                  onChange={e => handleChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={detail?.lastName ?? ''}
                  onChange={e => handleChange('lastName', e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={detail?.email ?? ''}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>

              {/* Role */}
              <div>
                <Label>Role</Label>
                <Select
                  value={detail?.role?.name ?? undefined}
                  onValueChange={value => {
                    const selectedRole = roles.find(role => role === value)
                    console.log(selectedRole)
                    handleChange(
                      'role',
                      selectedRole
                        ? {id: selectedRole === 'Admin' ? 1 : 2, name: selectedRole}
                        : {id: detail?.role?.id ?? 0, name: detail?.role?.name ?? ''},
                    )
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Input
                  value={detail?.status?.name ?? ''}
                  onChange={e =>
                    setDetail(prev => ({
                      ...prev!,
                      status: {...prev!.status, name: e.target.value},
                    }))
                  }
                  disabled
                />
              </div>
              <div>
                <Label>Created At</Label>
                <Input
                  value={
                    detail?.createdAt
                      ? new Intl.DateTimeFormat('en-US').format(new Date(detail?.createdAt))
                      : ''
                  }
                  disabled
                />
              </div>

              <div>
                <Label>Updated At</Label>
                <Input
                  value={
                    detail?.updatedAt
                      ? new Intl.DateTimeFormat('en-US').format(new Date(detail?.updatedAt))
                      : ''
                  }
                  disabled
                />
              </div>

              {detail.status?.id === 1 ? (
                <Button
                  className='w-full space-x-4'
                  variant='destructive'
                  onClick={() => handleStatusUpdate(2)}>
                  Set Inactive
                </Button>
              ) : (
                <Button
                  className='w-full space-x-4 bg-emerald-500'
                  variant='default'
                  onClick={() => handleStatusUpdate(1)}>
                  Set Active
                </Button>
              )}

              {/* Save Button */}
              <div className='flex space-x-4'>
                <Button className='flex-1' onClick={handleSave}>
                  Save Changes
                </Button>
                <Button
                  variant='secondary'
                  className='flex-1'
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                      window.history.back()
                    }
                  }}>
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
