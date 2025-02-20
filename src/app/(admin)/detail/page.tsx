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
import {Textarea} from '@src/core/components/ui/textarea'

export default function ProfilePage() {
  return (
    <SidebarInset>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>Others</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Setting</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col  overflow-y-auto gap-4 p-4 pt-0'>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {/* Avatar Section */}
              <div className=' flex items-center space-x-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src='https://github.com/shadcn.png' alt='Profile Picture' />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>Alexa Rawles</p>
                  <p className='text-sm text-muted-foreground'>alexarowles@gmail.com</p>
                </div>
              </div>

              {/* Full Name */}
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input id='fullName' placeholder='Enter your full name' />
              </div>
              {/* Description */}

              <div className='space-y-2'>
                <Label htmlFor='fullName'>Description</Label>
                <Textarea id='fullName' placeholder='Enter your full name' />
              </div>
              {/* Gender */}
              <div className='space-y-2'>
                <Label htmlFor='gender'>Gender</Label>
                <Input id='gender' placeholder='Enter your gender' />
              </div>

              {/* Country */}
              <div className='space-y-2'>
                <Label htmlFor='country'>Country</Label>
                <Input id='country' placeholder='Enter your country' />
              </div>

              {/* Time Zone */}
              <div className='space-y-2'>
                <Label htmlFor='timeZone'>Time Zone</Label>
                <Input id='timeZone' placeholder='Enter your time zone' />
              </div>

              {/* Email Address */}
              <div className='space-y-2'>
                <Label>My Email Address</Label>
                <div className='flex items-center justify-between'>
                  <p>alexarowles@gmail.com</p>
                  <Button variant='outline'>Edit</Button>
                </div>
              </div>

              {/* Add Email Address */}
              <div className='space-y-2'>
                <Button variant='outline' className='w-full'>
                  + Add Email Address
                </Button>
              </div>
              <div className='flex'>
                <Button variant='destructive' className='flex-1'>
                  Ban
                </Button>
              </div>
              {/* Button Banners */}
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
