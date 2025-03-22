'use client'

import {Package, packageService} from '@/core/services/user/package-service'
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
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'

export default function AllPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])

  const fetchPackages = async () => {
    try {
      const data = await packageService.getAllPackages()
      setPackages(data)
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this package?')
    if (!confirmDelete) return

    try {
      await packageService.deletePackage(id)
      alert('Package deleted successfully!')
      fetchPackages()
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Failed to delete package.')
    }
  }

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
                <BreadcrumbPage>All Packages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className='flex-1 flex'>
          {/* Main Content Area */}
          <div className='flex-1 p-6 overflow-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold'>All Packages</h2>
              <Link href='/ad-create-package'>
                <Button>Create New Package</Button>
              </Link>
            </div>

            {packages.length === 0 ? (
              <p>No packages available.</p>
            ) : (
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {packages.map(pkg => {
                  const isOpen = Number(pkg.status) === 1
                  return (
                    <Card key={pkg.package_id} className='p-4'>
                      <h3 className='text-xl font-bold'>{pkg.name}</h3>
                      <p className='text-gray-600'>{pkg.description}</p>
                      <div className='mt-2'>
                        <span className='block text-sm'>
                          <strong>Price:</strong> {pkg.price}
                        </span>
                        <span className='block text-sm'>
                          <strong>Duration:</strong> {pkg.duration} month(s)
                        </span>
                        <span className='block text-sm'>
                          <strong>Status:</strong>{' '}
                          <span className={isOpen ? 'text-green-500' : 'text-red-500'}>
                            {isOpen ? 'OPEN' : 'LOCKED'}
                          </span>
                        </span>
                        <span className='block text-sm'>
                          <strong>Created at:</strong> {new Date(pkg.created_at).toLocaleString()}
                        </span>

                        <Link href={`/ad-edit-package/${pkg.package_id}`}>
                          <Button>Edit</Button>
                        </Link>
                        <Button onClick={() => handleDelete(pkg.package_id)}>Delete</Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
