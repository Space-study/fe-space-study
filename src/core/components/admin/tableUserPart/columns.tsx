'use client'

import {Checkbox} from '@src/core/components/ui/checkbox'
import {UserType} from '@src/core/services/admin/user/user-service'
import {ColumnDef} from '@tanstack/react-table'
import {ShieldBan, ShieldCheck} from 'lucide-react'
import {DataTableColumnHeader} from './tableColumnHeader'

export const statuses = [
  {
    value: 'Active',
    label: 'Active',
    icon: ShieldCheck,
  },
  {
    value: 'Inactive',
    label: 'Inactive',
    icon: ShieldBan,
  },
]

// Function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const columns: ColumnDef<UserType>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({column}) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({row}) => (
      <div className='w-[200px]'>{`${row.original.firstName} ${row.original.lastName}`}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({column}) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({row}) => <div className='w-[200px]'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({column}) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({row}) => <div className='w-[120px]'>{row.original.role.name}</div>,
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id)
      if (typeof rowValue === 'object' && rowValue !== null && 'name' in rowValue) {
        return value.includes((rowValue as {name: string}).name)
      }
    },
  },
  {
    accessorKey: 'status',
    header: ({column}) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({row}) => {
      const statusName = row.original.status?.name
      const status = statuses.find(status => status.value === statusName)

      if (!status) return <div className='w-[100px]'>Unknown</div>
      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id)
      if (typeof rowValue === 'object' && rowValue !== null && 'name' in rowValue) {
        return value.includes((rowValue as {name: string}).name)
      }
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({column}) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({row}) => <div className='w-[150px]'>{formatDate(row.original.createdAt)}</div>,
  },
  {
    accessorKey: 'updatedAt',
    header: ({column}) => <DataTableColumnHeader column={column} title='Updated At' />,
    cell: ({row}) => <div className='w-[150px]'>{formatDate(row.original.updatedAt)}</div>,
  },
  {
    accessorKey: 'deletedAt',
    header: ({column}) => <DataTableColumnHeader column={column} title='Deleted At' />,
    cell: ({row}) => <div className='w-[150px]'>{formatDate(row.original.deletedAt)}</div>,
  },
]
