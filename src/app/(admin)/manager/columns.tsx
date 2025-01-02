'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import {Button} from '@src/core/components/shadcn/button'
import {Checkbox} from '@src/core/components/shadcn/checkbox'
import {UserResponse} from '@src/core/types/user.type'
import {ColumnDef} from '@tanstack/react-table'
import {ArrowUpDown, MoreHorizontal} from 'lucide-react'

export const columns: ColumnDef<UserResponse>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: ({row}) => <div className='capitalize'>{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({column}) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({row}) => <div className='lowercase'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'provider',
    header: 'Provider',
    cell: ({row}) => <div className='capitalize'>{row.getValue('provider')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => <div className='capitalize'>{row.getValue('status')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0 border border-gray-300 rounded-md hover:border-gray-500'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='border border-gray-300 rounded-md bg-gray-100'>
            <DropdownMenuLabel className='p-2 border-b border-gray-300 bg-slate-300'>
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='p-2'>
              <div className='flex items-center'>
                <span className='pr-2 pt-1 '>👤</span>User Profile
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className='p-2'>
              <div className='flex items-center'>
                <span className='pr-2 pt-1'>⭐</span>Set to Admin
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className='p-2'>
              <div className='flex items-center'>
                <span className='pr-2 pt-1 '>🚫</span>Ban User
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
