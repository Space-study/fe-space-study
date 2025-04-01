'use client'

import {Button} from '@src/core/components/ui/button'
import {Input} from '@src/core/components/ui/input'
import {Table} from '@tanstack/react-table'
import {ShieldBan, ShieldCheck, X} from 'lucide-react'
import {AddNew} from './dialog'
import {DataTableFacetedFilter} from './tableFacetedFilter'
import {DataTableViewOptions} from './tableViewOptions'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}
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
export const roles = [
  {
    value: 'Admin',
    label: 'Admin',
    icon: ShieldCheck,
  },
  {
    value: 'User',
    label: 'User',
    icon: ShieldBan,
  },
]

export function DataTableToolbar<TData>({table}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between space-y-2'>
      <div className='flex flex-1 items-center space-x-2 '>
        <Input
          placeholder='Filter tasks...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px] bg-white'
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={statuses}
          />
        )}
        {table.getColumn('role') && (
          <DataTableFacetedFilter column={table.getColumn('role')} title='Role' options={roles} />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'>
            Reset
            <X />
          </Button>
        )}
      </div>
      <AddNew />
      <DataTableViewOptions table={table} />
    </div>
  )
}
