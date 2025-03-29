'use client'

import {
  BookOpenCheck,
  Dock,
  EllipsisVertical,
  Landmark,
  ScanEye,
  SquareTerminal,
  UserRoundPen,
  Video,
} from 'lucide-react'
import * as React from 'react'

import {NavMain} from '@/core/components/admin/sidebar/nav-main'
import {NavUser} from '@/core/components/admin/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@src/core/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: 'DashBoard',
      url: '#',
      icon: SquareTerminal,
      items: [
        {
          title: 'Statics',
          url: 'dashboard',
        },
      ],
    },
    {
      title: 'User Management',
      url: '#',
      icon: UserRoundPen,
      items: [
        {
          title: 'List',
          url: 'user',
        },
      ],
    },
    {
      title: 'Managing Learning Spaces',
      url: '#',
      icon: Dock,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Content Management',
      url: '#',
      icon: BookOpenCheck,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
        {
          title: 'Blog',
          url: 'blog-admin',
        },
      ],
    },
    {
      title: 'Revenue Management',
      url: '#',
      icon: Landmark,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
    {
      title: 'Room Management',
      url: '#',
      icon: Video,
      items: [
        {
          title: 'Background',
          url: 'backgrounds',
        },
        {
          title: 'Music',
          url: 'music',
        },
      ],
    },
    {
      title: 'Others',
      url: '#',
      icon: EllipsisVertical,
      items: [
        {
          title: 'Setting',
          url: 'setting',
        },
        {
          title: 'Chat',
          url: 'chat',
        },
      ],
    },
  ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='py-5'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <ScanEye className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <h1 className='text-2xl font-bold'>FocusHub</h1>{' '}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
