'use client'

import {ProfileService} from '@/core/services/auth/auth'
import {useUser} from '@src/app/shared/UserProvider'
import {Avatar, AvatarFallback, AvatarImage} from '@src/core/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/core/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@src/core/components/ui/sidebar'
import {BadgeCheck, Bell, ChevronsUpDown, LogOut} from 'lucide-react'
import {useEffect, useMemo, useState} from 'react'
import {toast} from 'sonner'

type User = {
  lastName: string
  email: string
  avatar: string
}

export function NavUser() {
  const {isMobile} = useSidebar()
  const [user, setUser] = useState<User | null>(null)
  const {logout} = useUser()
  const profileService = useMemo(() => new ProfileService(), [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile()
        setUser({
          lastName: data?.lastName || '',
          email: data?.email || '',
          avatar: data?.photo?.path || '',
        })
      } catch (error) {
        toast.error('Failed to load profile: ' + error)
      }
    }
    fetchProfile()
  }, [profileService])

  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to logout?')
    if (confirm) {
      localStorage.removeItem('authToken')
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
      logout()
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user?.avatar || ''} alt={user?.lastName || 'User'} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.lastName || 'Guest'}</span>
                <span className='truncate text-xs'>{user?.email || 'guest@example.com'}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user?.avatar || ''} alt={user?.lastName || 'User'} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>{user?.lastName || 'Guest'}</span>
                  <span className='truncate text-xs'>{user?.email || 'guest@example.com'}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => (window.location.href = '/account')}>
                <BadgeCheck className='mr-2 h-4 w-4' />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = '/notification')}>
                <Bell className='mr-2 h-4 w-4' />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
