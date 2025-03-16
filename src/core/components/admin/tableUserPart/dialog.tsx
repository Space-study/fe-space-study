import {Button} from '@src/core/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@src/core/components/ui/dialog'
import {Input} from '@src/core/components/ui/input'
import {Label} from '@src/core/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@src/core/components/ui/select'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'
import {Eye, EyeOff, Plus} from 'lucide-react' // Import icon
import {useMemo, useState} from 'react'
import {toast} from 'sonner'

interface AddUser {
  id: number
  email: string
  provider: string
  socialId: string
  password: string
  firstName: string
  lastName: string
  role: {
    id: number
    name: string
  }
  status: {
    id: number
    name: string
  }
}

export function AddNew() {
  const url = useMemo(() => {
    return new RequestBuilder()
      .setPrefix('api')
      .setVersion('v1')
      .setResourcePath('users')
      .buildUrl()
  }, [])
  const [formData, setFormData] = useState<AddUser>({
    id: 0,
    email: '',
    provider: '',
    socialId: '',
    password: '',
    firstName: '',
    lastName: '',
    role: {id: 0, name: ''},
    status: {id: 0, name: ''},
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (field: keyof AddUser, value: string | number) => {
    setFormData(prev => {
      if (field === 'role') {
        return {...prev, role: {id: Number(value), name: Number(value) === 1 ? 'Admin' : 'User'}}
      }
      if (field === 'status') {
        return {
          ...prev,
          status: {id: Number(value), name: Number(value) === 1 ? 'Active' : 'Inactive'},
        }
      }
      return {...prev, [field]: value}
    })
  }

  const handleSubmit = async () => {
    const {email, password, role, status} = formData

    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error('Invalid email format')
      return
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!role?.id) {
      toast.error('Please select a role')
      return
    }

    if (!status?.id) {
      toast.error('Please select a status')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        toast.error('Unauthorized: Please log in')
        return
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create user')
      }

      const result = await response.json()
      console.log('User created:', result.status)

      window.location.href = '/user'

      toast.success('New user has been created', {
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      })
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex mr-1'>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {/* Email */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email
            </Label>
            <Input
              id='email'
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder='test1@example.com'
              className='col-span-3'
            />
          </div>
          {/* Password */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='password' className='text-right'>
              Password
            </Label>
            <div className='relative col-span-3'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder='••••••••'
                className='pr-10'
              />
              <button
                type='button'
                className='absolute right-2 top-2 text-gray-400 hover:text-gray-600'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {/* First Name */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='firstName' className='text-right'>
              First Name
            </Label>
            <Input
              id='firstName'
              value={formData.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              placeholder='John'
              className='col-span-3'
            />
          </div>
          {/* Last Name */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='lastName' className='text-right'>
              Last Name
            </Label>
            <Input
              id='lastName'
              value={formData.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              placeholder='Doe'
              className='col-span-3'
            />
          </div>
          {/* Role */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='roleId' className='text-right'>
              Role
            </Label>
            <Select
              value={formData.role.id.toString()}
              onValueChange={value => handleChange('role', value)}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Admin</SelectItem>
                <SelectItem value='2'>User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Status */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='statusId' className='text-right'>
              Status
            </Label>
            <Select
              value={formData.status.id.toString()}
              onValueChange={value => handleChange('status', value)}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>Active</SelectItem>
                <SelectItem value='2'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
