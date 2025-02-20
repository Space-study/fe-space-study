'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@src/core/components/ui/table'
import {RefreshCw, Search} from 'lucide-react' // Import icons

import {Button} from '@src/core/components/ui/button'
import {Checkbox} from '@src/core/components/ui/checkbox'
import {Input} from '@src/core/components/ui/input'
import {useRouter} from 'next/navigation' // Import useRouter
import * as React from 'react'

const data = [
  {
    id: 'm5gr84i9',
    amount: 316,
    status: 'success',
    email: 'ken99@yahoo.com',
  },
  {
    id: '3u1reuv4',
    amount: 242,
    status: 'success',
    email: 'Abe45@gmail.com',
  },
  {
    id: 'derv1ws0',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@gmail.com',
  },
  {
    id: '5kma53ae',
    amount: 874,
    status: 'success',
    email: 'Silas22@gmail.com',
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    status: 'failed',
    email: 'carmella@hotmail.com',
  },
]

export default function Notification() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isReloading, setIsReloading] = React.useState(false)
  const router = useRouter() // Initialize useRouter

  const filteredData = data.filter(item =>
    item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Simulate a reload action
  const handleReload = () => {
    setIsReloading(true)
    setTimeout(() => {
      setIsReloading(false)
    }, 1000) // Simulate a 1-second delay
  }

  // Navigate to the detail page
  const handleRowClick = () => {
    router.push(`/detail`) // Navigate to the detail page with the row ID
    // ${id}
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
                <BreadcrumbLink href='#'>Notification</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>List</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col  overflow-y-auto gap-4 p-4 pt-0'>
        <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min'>
          <div className='w-full'>
            <div className='flex items-center justify-between py-4'>
              <div className='relative flex items-center'>
                <Search className='absolute left-2 h-4 w-4 text-muted-foreground' />{' '}
                {/* Search icon */}
                <Input
                  placeholder='Filter emails...'
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  className='max-w-sm pl-8' // Add padding for the icon
                />
              </div>
              <Button variant='outline' onClick={handleReload} disabled={isReloading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />{' '}
                {/* Reload icon with spin animation */}
                {isReloading ? 'Reloading...' : 'Reload'}
              </Button>
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length ? (
                    filteredData.map(row => (
                      <TableRow
                        key={row.id}
                        onClick={() => handleRowClick()} // Make the entire row clickable
                        className='cursor-pointer hover:bg-gray-50' // Add hover effect
                      >
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Checkbox aria-label='Select row' />
                        </TableCell>
                        <TableCell>
                          <div className='capitalize'>{row.status}</div>
                        </TableCell>
                        <TableCell>
                          <div className='lowercase'>{row.email}</div>
                        </TableCell>
                        <TableCell className='text-right font-medium'>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className='h-24 text-center'>
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>{' '}
        </div>
      </div>
    </SidebarInset>
  )
}
