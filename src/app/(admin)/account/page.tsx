'use client'

import {ProfileService, ProfileType} from '@/core/services/auth/auth'
import {resetPasswordSchema, type ResetPasswordData} from '@/core/utils/validation/auth'
import {zodResolver} from '@hookform/resolvers/zod'
import {Avatar, AvatarFallback, AvatarImage} from '@src/core/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@src/core/components/ui/breadcrumb'
import {Button} from '@src/core/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/core/components/ui/card'
import {Form, FormControl, FormField, FormItem, FormMessage} from '@src/core/components/ui/form'
import {Input} from '@src/core/components/ui/input'
import {Label} from '@src/core/components/ui/label'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@src/core/components/ui/tabs'
import {Eye, EyeOff} from 'lucide-react' // Import icon
import {useEffect, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'
import {toast} from 'sonner'

export default function SettingSetting() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('authToken')
  const profileService = useMemo(() => new ProfileService(), [])
  const [showPassword, setShowPassword] = useState(false)

  console.log(token)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile()
        setProfile(data)
      } catch (error) {
        toast.error('Failed to load profile' + error)
      }
    }
    fetchProfile()
  }, [profileService])

  const handleSaveProfile = async () => {
    if (!profile) return
    setLoading(true)
    try {
      await profileService.updateProfile(profile)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile' + error)
    } finally {
      setLoading(false)
    }
  }
  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onTouched',
  })

  const handleSavePassword = async (data: ResetPasswordData) => {
    if (!token) {
      toast.error('Token is missing')
      return
    }

    setLoading(true)
    try {
      await profileService.resetPassword(data.password, token)
      toast.success('Password updated successfully')
      form.reset()
    } catch (error) {
      toast.error(`Failed to update password:` + error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ProfileType, value: string) => {
    if (!profile) return
    setProfile({...profile, [field]: value})
  }
  return (
    <SidebarInset>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='account'>Account</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Tabs defaultValue='profile' className='w-full'>
        <div className='flex flex-1 flex-col gap-4 px-4 py-4'>
          <div className='mx-auto h-full w-full rounded-xl bg-muted/50'>
            <TabsList className='grid grid-cols-10'>
              <TabsTrigger value='profile'>My Profile</TabsTrigger>
              <TabsTrigger value='password'>Reset Password</TabsTrigger>
            </TabsList>
          </div>
          <div className='mx-auto h-full w-full rounded-xl bg-muted/50'>
            <TabsContent value='profile'>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {profile ? (
                    <>
                      <div className='flex items-center space-x-4'>
                        <div className='flex flex-row items-center space-x-5'>
                          <Avatar className='h-24 w-24'>
                            <AvatarImage
                              src={profile.photo?.path || 'https://github.com/shadcn.png'}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col space-y-1'>
                            <Label htmlFor='userName'>
                              {profile.firstName} {profile.lastName}
                            </Label>
                            <Label htmlFor='email'>{profile.email}</Label>
                          </div>
                          <Button variant='outline'>Upload</Button>
                        </div>
                      </div>
                      <div className='space-y-1'>
                        <Label htmlFor='firstName'>First Name</Label>
                        <Input
                          id='firstName'
                          value={profile.firstName}
                          onChange={e => handleChange('firstName', e.target.value)}
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='lastName'>Last Name</Label>
                        <Input
                          id='lastName'
                          value={profile.lastName}
                          onChange={e => handleChange('lastName', e.target.value)}
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                          id='email'
                          value={profile.email}
                          onChange={e => handleChange('email', e.target.value)}
                          disabled
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='provider'>Provider</Label>
                        <Input
                          id='provider'
                          value={profile.provider}
                          onChange={e => handleChange('provider', e.target.value)}
                          disabled
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='role'>Role</Label>
                        <Input
                          id='role'
                          value={profile.role?.name}
                          onChange={e => handleChange('role', e.target.value)}
                          disabled
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='status'>Status</Label>
                        <Input
                          id='status'
                          value={profile.status?.name}
                          onChange={e => handleChange('status', e.target.value)}
                          disabled
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='createdAt'>Created At</Label>
                        <Input
                          id='createdAt'
                          value={new Date(profile.createdAt).toLocaleString()}
                          onChange={e => handleChange('createdAt', e.target.value)}
                          disabled
                        />
                      </div>

                      <div className='space-y-1'>
                        <Label htmlFor='updatedAt'>Updated At</Label>
                        <Input
                          id='updatedAt'
                          value={new Date(profile.updatedAt).toLocaleString()}
                          onChange={e => handleChange('updatedAt', e.target.value)}
                          disabled
                        />
                      </div>
                    </>
                  ) : (
                    <div>Loading...</div>
                  )}
                </CardContent>
                <CardFooter className='flex justify-end'>
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? 'Saving...' : 'Save changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='password'>
              <Card className='flex justify-center flex-col items-center'>
                <CardHeader className='space-y-2 w-1/2'>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password here.</CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSavePassword)}
                    className='space-y-4 w-1/2'>
                    <CardContent className='space-y-2'>
                      <FormField
                        control={form.control}
                        name='password'
                        render={({field}) => (
                          <FormItem>
                            <Label htmlFor='new'>New password</Label>
                            <div className='relative'>
                              <FormControl>
                                <Input
                                  id='new'
                                  type={showPassword ? 'text' : 'password'}
                                  className={`pr-10 ${
                                    form.formState.errors.password
                                      ? 'border-red-500'
                                      : 'border-gray-300'
                                  }`}
                                  {...field}
                                />
                              </FormControl>
                              <button
                                type='button'
                                className='absolute right-2 top-2 text-gray-400 hover:text-gray-600'
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                            {form.formState.errors.password && (
                              <FormMessage>{form.formState.errors.password.message}</FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className='flex justify-end space-x-2'>
                      <Button variant='destructive' type='button' onClick={() => form.reset()}>
                        Cancel
                      </Button>
                      <Button type='submit' disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </SidebarInset>
  )
}
