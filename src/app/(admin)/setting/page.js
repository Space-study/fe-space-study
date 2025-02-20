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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {Label} from '@src/core/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@src/core/components/ui/radio-group'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@src/core/components/ui/tabs'

export default function dashboard() {
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
      <Tabs defaultValue='profile' className='w-full'>
        <div className='flex flex-1 flex-col gap-4 px-4 py-4'>
          <div className='mx-auto h-full w-full rounded-xl bg-muted/50'>
            <TabsList className='grid grid-cols-10'>
              <TabsTrigger value='profile'>My Profile</TabsTrigger>
              <TabsTrigger value='password'>Password</TabsTrigger>
              <TabsTrigger value='notification'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <div className='mx-auto h-full w-full rounded-xl bg-muted/50'>
            <TabsContent value='profile'>
              <Card>
                <CardHeader>
                  <CardTitle>Persional Information</CardTitle>
                  <CardDescription>Update your persional information</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex flex-row items-center space-x-5 '>
                      <Avatar>
                        <AvatarImage src='https://github.com/shadcn.png' />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col space-y-1'>
                        <Label htmlFor='userName'>User name</Label>
                        <Label htmlFor='name'>Email@example.com</Label>
                      </div>
                      <Button variant='outline'>Upload</Button>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <Label htmlFor='userName'>User Name</Label>
                    <Input id='UserName' defaultValue='userName' />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' defaultValue='Email@example.com' />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <Input id='phone' defaultValue='Phone number' />
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end'>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='password'>
              <Card className='flex justify-center flex-col items-center'>
                <CardHeader className=' space-y-2 w-1/2'>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password here.</CardDescription>
                </CardHeader>
                <CardContent className=' space-y-2 w-1/2'>
                  <div className='space-y-1'>
                    <Label htmlFor='current'>Current password</Label>
                    <Input id='current' type='password' />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='new'>New password</Label>
                    <Input id='new' type='password' />
                  </div>
                  <div className='space-y-1'>
                    <Label htmlFor='confirm'>Confirm new password</Label>
                    <Input id='confirm' type='password' />
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end w-1/2 space-x-2'>
                  <Button variant='destructive'>Cancel</Button>
                  <Button>Save</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value='notification'>
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Notifications for post comments and comment replies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue='all'>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='not' id='r1' />
                      <Label htmlFor='r1'>Do not notify me</Label>
                    </div>
                    <div className='flex flex-col space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='only' id='r2' aria-describedby='desc-r2' />
                        <Label htmlFor='r2'>Mentions only</Label>
                      </div>
                      <p id='desc-r2' className='pl-6'>
                        Only notify me if I&apos;m mentioned in a comment.
                      </p>
                    </div>
                    <div className='flex flex-col space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='all' id='r3' aria-describedby='desc-r3' />
                        <Label htmlFor='r3'>All comments</Label>
                      </div>
                      <p id='desc-r3' className='pl-6'>
                        Notify me for all comments on my posts.
                      </p>
                    </div>
                  </RadioGroup>
                </CardContent>

                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </SidebarInset>
  )
}
