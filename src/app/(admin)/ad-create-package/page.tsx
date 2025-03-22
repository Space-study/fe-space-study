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
import {Input} from '@src/core/components/ui/input'
import {ScrollArea} from '@src/core/components/ui/scroll-area'
import {Separator} from '@src/core/components/ui/separator'
import {SidebarInset, SidebarTrigger} from '@src/core/components/ui/sidebar'
import React, {useEffect, useState} from 'react'

export default function CreatePackagePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    status: 'OPEN',
  })

  const [otherPackages, setOtherPackages] = useState<Package[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const statusValue = formData.status === 'OPEN' ? 1 : 2

    const data = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      status: statusValue,
    }
    try {
      await packageService.createPackage(data)
      alert('Package created successfully!')

      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        status: 'OPEN',
      })

      fetchOtherPackages()
    } catch (error) {
      console.error('Error creating package:', error)
      alert('Error creating package')
    }
  }

  const fetchOtherPackages = async () => {
    try {
      const packages = await packageService.getAllPackages()
      setOtherPackages(packages)
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  useEffect(() => {
    fetchOtherPackages()
  }, [])

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
                <BreadcrumbPage>Create Package</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className='flex-1 flex'>
          {/* Form Area */}
          <div className='flex-1 p-6'>
            <Card className='p-6 max-w-lg mx-auto'>
              <h2 className='text-2xl font-semibold mb-4'>Create New Package</h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label htmlFor='name' className='block mb-1 font-medium'>
                    Name
                  </label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Package Name'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='description' className='block mb-1 font-medium'>
                    Description
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Package Description'
                    className='w-full h-auto p-2 border border-gray-300 rounded-md bg-white'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='price' className='block mb-1 font-medium'>
                    Price
                  </label>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    value={formData.price}
                    onChange={handleChange}
                    placeholder='Price'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='duration' className='block mb-1 font-medium'>
                    Duration (months)
                  </label>
                  <Input
                    id='duration'
                    name='duration'
                    type='number'
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder='Duration in months'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='status' className='block mb-1 font-medium'>
                    Status
                  </label>
                  <select
                    id='status'
                    name='status'
                    value={formData.status}
                    onChange={handleChange}
                    className='w-full p-2 border border-gray-300 rounded-md bg-white'>
                    <option value='OPEN'>OPEN</option>
                    <option value='LOCKED'>LOCKED</option>
                  </select>
                </div>
                <Button type='submit' className='w-full'>
                  Create Package
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='w-80 border-l'>
            <div className='p-4'>
              <h3 className='font-semibold mb-4'>Other Packages</h3>
              <ScrollArea className='h-[800px]'>
                {otherPackages.length === 0 ? (
                  <p>No packages available.</p>
                ) : (
                  otherPackages.map(pkg => {
                    const statusText = Number(pkg.status) === 1 ? 'OPEN' : 'LOCKED'
                    return (
                      <div
                        key={pkg.package_id}
                        className='flex flex-col p-2 border-b border-gray-200'>
                        <span className='font-medium'>{pkg.name}</span>
                        <span className='text-sm text-gray-500'>
                          Price: {pkg.price} - Duration: {pkg.duration} month(s)
                        </span>
                        <span className='text-sm text-gray-500'>Status: {statusText}</span>
                      </div>
                    )
                  })
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
