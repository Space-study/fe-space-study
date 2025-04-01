import {ChatAdminWidget} from '@/core/components/admin/chatAdmin/chatAdmin-widget'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@src/core/components/ui/breadcrumb'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
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
                <BreadcrumbLink href='chat'>Chat Admin</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className='flex flex-1 h-full flex-col overflow-y-auto gap-4 p-4 pt-0'>
          <ChatAdminWidget />
        </div>
      </div>
    </SidebarInset>
  )
}

export default ChatInterface
