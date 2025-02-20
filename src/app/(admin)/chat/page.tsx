import {Avatar, AvatarFallback, AvatarImage} from '@src/core/components/ui/avatar'
import {Badge} from '@src/core/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import {Button} from '@src/core/components/ui/button'
import {Card} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {ScrollArea} from '@src/core/components/ui/scroll-area'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import {Image, Mic, MoreVertical, Paperclip, Phone, Send, Smile, Video} from 'lucide-react'
import React from 'react'

const ChatInterface = () => {
  return (
    <SidebarInset>
      <div className='h-screen overflow-hidden flex flex-col'>
        {/* Header */}
        <header className='h-16 flex items-center gap-2 px-4 border-b'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className='flex-1 flex'>
          {/* Chat Area */}
          <div className='flex-1 flex flex-col'>
            {/* Chat Header */}
            <div className='border-b p-4 flex justify-between items-center'>
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage src='/api/placeholder/32/32' />
                  <AvatarFallback>TW</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className='font-semibold'>Theresa Webb</h2>
                  <p className='text-sm text-green-500'>Online</p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <Button variant='ghost' size='icon'>
                  <Phone className='h-5 w-5' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <Video className='h-5 w-5' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <MoreVertical className='h-5 w-5' />
                </Button>
              </div>
            </div>

            {/* Messages Area with Scroll */}

            <div className='flex-1 p-4 overflow-hidden'>
              <ScrollArea className='h-full'>
                <div className='space-y-4 overflow-auto max-h-[calc(100vh-300px)]'>
                  {/* Incoming Message */}
                  <div className='flex items-start space-x-2'>
                    <Avatar className='mt-1'>
                      <AvatarImage src='/api/placeholder/32/32' />
                      <AvatarFallback>TW</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium'>Theresa Webb</span>
                        <span className='text-sm text-gray-500'>2:09 PM</span>
                      </div>
                      <Card className='p-3 mt-1'>
                        <p>Hi, I am back from vacation</p>
                      </Card>
                      <Card className='p-3 mt-1'>
                        <p>How are you?</p>
                      </Card>
                    </div>
                  </div>

                  {/* Outgoing Message */}
                  <div className='flex items-start justify-end space-x-2'>
                    <div className='flex flex-col items-end'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm text-gray-500'>2:09 PM</span>
                        <span className='font-medium'>Alon Smith</span>
                      </div>
                      <Card className='p-3 mt-1 bg-blue-500 text-white'>
                        <p>Welcome Back</p>
                      </Card>
                      <Card className='p-3 mt-1 bg-blue-500 text-white'>
                        <p>I am all well</p>
                      </Card>
                    </div>
                    <Avatar className='mt-1'>
                      <AvatarImage src='/api/placeholder/32/32' />
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input Area (Sticky at Bottom) */}
            <div className='sticky bottom-0 border-t bg-white p-4'>
              <div className='flex items-center space-x-2'>
                <Button variant='ghost' size='icon'>
                  <Paperclip className='h-5 w-5' />
                </Button>
                <Input className='flex-1' placeholder='Type a message...' />
                <Button variant='ghost' size='icon'>
                  <Smile className='h-5 w-5' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <Image className='h-5 w-5' />
                </Button>
                <Button variant='ghost' size='icon'>
                  <Mic className='h-5 w-5' />
                </Button>
                <Button size='icon' className='bg-blue-500 text-white hover:bg-blue-600'>
                  <Send className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='w-80 border-l'>
            <div className='p-4'>
              <h3 className='font-semibold mb-4'>Chats</h3>

              {/* Chat List Scrollable */}
              <ScrollArea className='h-[300px]'>
                {[
                  'Theresa Webb',
                  'Dianne Russell',
                  'Jacob Jones',
                  'Wade Warren',
                  'Brooklyn Simmons',
                ].map((name, i) => (
                  <div
                    key={i}
                    className='flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                    <Avatar>
                      <AvatarImage src='/api/placeholder/32/32' />
                      <AvatarFallback>
                        {name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <span className='font-medium'>{name}</span>
                        <span className='text-sm text-gray-500'>2:09 PM</span>
                      </div>
                      <p className='text-sm text-gray-500'>Coffee?</p>
                    </div>
                    <Badge className='bg-blue-500'>1</Badge>
                  </div>
                ))}
              </ScrollArea>

              {/* Group List */}
              <h3 className='font-semibold mt-6 mb-4'>Groups</h3>
              <ScrollArea className='h-[200px]'>
                {['Student Hub', 'Society Group'].map((name, i) => (
                  <div
                    key={i}
                    className='flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                    <Avatar>
                      <AvatarImage src='/api/placeholder/32/32' />
                      <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='flex justify-between'>
                        <span className='font-medium'>{name}</span>
                        <span className='text-sm text-gray-500'>2:09 PM</span>
                      </div>
                      <p className='text-sm text-gray-500'>Coffee?</p>
                    </div>
                    <Badge className='bg-blue-500'>1</Badge>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default ChatInterface
