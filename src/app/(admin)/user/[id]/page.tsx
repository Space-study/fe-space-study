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
import {RequestBuilder} from '@src/core/utils/axios/request-builder'
import {useEffect, useMemo, useRef, useState} from 'react'

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

const roles = ['Admin', 'User']

export default function ProfilePage() {
  const [detail, setDetail] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem('authToken')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [initialEmail, setInitialEmail] = useState<string | null>(null)

  const url = useMemo(() => {
    return new RequestBuilder()
      .setPrefix('api')
      .setVersion('v1')
      .setResourcePath('users')
      .buildUrl()
  }, [])

  const urlFile = useMemo(() => {
    return new RequestBuilder()
      .setPrefix('api')
      .setVersion('v1')
      .setResourcePath('files')
      .buildUrl('upload')
  }, [])

  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true)
      setError(null)

      const id = window.location.pathname.split('/').pop()
      if (!token) return

      try {
        const response = await fetch(`${url}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error(`Failed to fetch profile: ${response.status}`)

        const result = await response.json()
        setDetail(prev => ({
          ...result,
          role: result.role ?? (prev?.role || {id: 0, name: ''}),
          status: result.status ?? (prev?.status || {id: 0, name: ''}),
        }))
        setInitialEmail(result.email) // Lưu email ban đầu
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Failed to fetch profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [url, token])

  // Tái sử dụng để cập nhật state
  const handleChange = (key: keyof UserProfile, value: unknown) => {
    setDetail(prev => (prev ? {...prev, [key]: value} : null))
  }

  // Thêm hàm upload file
  async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(urlFile, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error(`Failed to upload file: ${response.status}`)

      const result = await response.json()
      console.log('File uploaded:', result)
      return result.path // Trả về đường dẫn của file được tải lên
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const updateStatus = async (statusId: number) => {
    if (!detail) return

    try {
      setLoading(true)
      setError(null)

      // Cập nhật state trước
      setDetail(prev => {
        if (!prev) return null
        return {
          ...prev,
          status: {
            id: statusId,
            name: statusId === 1 ? 'Active' : 'Inactive',
          },
        }
      })

      const response = await fetch(`${url}/${detail.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({status: {id: statusId}}),
      })

      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`)

      const result = await response.json()
      setDetail(result) // Cập nhật lại state với dữ liệu mới
      alert('Status updated successfully!')
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Cập nhật logic trong saveChange
  async function saveChange() {
    if (!detail) return

    try {
      setLoading(true)
      setError(null)

      if (!detail.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(detail.email)) {
        alert('Invalid email format')
        return
      }

      // Chỉ gửi email nếu có sự thay đổi
      const data: Record<string, unknown> = {
        firstName: detail.firstName,
        lastName: detail.lastName,
        role: {
          id: detail.role.id,
          name: detail.role.name,
        },
      }

      if (detail.email !== initialEmail) {
        data.email = detail.email
      }

      console.log('Updating profile...')
      const response = await fetch(`${url}/${detail.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error(`Failed to update profile: ${response.status}`)

      const result = await response.json()
      setDetail(result)
      setInitialEmail(result.email) // Cập nhật giá trị ban đầu sau khi lưu thành công
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className='text-red-500'>{error}</p>
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
                        console.log('Uploading photo...')
                        const path = await uploadFile(file)

                        // Update avatar immediately with the uploaded file path
                        setDetail(prev => (prev ? {...prev, photo: {...prev.photo, path}} : null))

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

              {/* First Name */}
              <div>
                <Label>First Name</Label>
                <Input
                  value={detail?.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={detail?.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={detail?.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>

              {/* Role */}
              <div>
                <Label>Role</Label>
                <Select
                  value={detail?.role?.name || ''}
                  onValueChange={value => {
                    const selectedRole = roles.find(role => role === value)
                    handleChange(
                      'role',
                      selectedRole
                        ? {id: selectedRole === 'Admin' ? 1 : 2, name: selectedRole}
                        : {id: 0, name: ''},
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
                  value={detail?.status?.name}
                  onChange={e =>
                    setDetail({...detail, status: {...detail.status, name: e.target.value}})
                  }
                  disabled
                />
              </div>
              <div>
                <Label>Created At</Label>
                <Input
                  value={new Intl.DateTimeFormat('en-US').format(new Date(detail?.createdAt))}
                  disabled
                />
              </div>
              <div>
                <Label>Updated At</Label>
                <Input
                  value={new Intl.DateTimeFormat('en-US').format(new Date(detail?.updatedAt))}
                  disabled
                />
              </div>
              {detail.status?.id === 1 ? (
                <Button
                  className='w-full space-x-4'
                  variant='destructive'
                  onClick={() => updateStatus(2)}>
                  Set Inactive
                </Button>
              ) : (
                <Button
                  className='w-full space-x-4 bg-emerald-500'
                  variant='default'
                  onClick={() => updateStatus(1)}>
                  Set Active
                </Button>
              )}

              {/* Save Button */}
              <div className='flex space-x-4'>
                <Button className='flex-1' onClick={saveChange}>
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
