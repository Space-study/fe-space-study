'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@src/core/components/ui/input'
import { Button } from '@src/core/components/ui/button'
import { Card } from '@src/core/components/ui/card'
import { ScrollArea } from '@src/core/components/ui/scroll-area'
import { Separator } from '@src/core/components/ui/separator'
import { SidebarInset, SidebarTrigger } from '@src/core/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import { voucherService, Voucher } from '@src/core/services/admin/user/voucher-service'
import { useRouter } from 'next/navigation'

export default function CreateVoucherPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: '',
    is_active: true,
  })
  const [otherVouchers, setOtherVouchers] = useState<Voucher[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const today = new Date()
      const expDate = new Date(formData.expiry_date)

      if (expDate <= today) {
        alert('Expiry date must be later than today.')
        return
      }

      await voucherService.createVoucher({
        ...formData,
        discount_percentage: parseFloat(formData.discount_percentage),
        expiry_date: expDate.toISOString(),
      })

      alert('Voucher created successfully!')
      router.push('/voucher')
    } catch (error) {
      console.error('Failed to create voucher:', error)
      alert('Creation failed.')
    }
  }

  const fetchOtherVouchers = async () => {
    try {
      const data = await voucherService.getAllVouchers()
      setOtherVouchers(data)
    } catch (error) {
      console.error('Failed to fetch vouchers:', error)
    }
  }

  useEffect(() => {
    fetchOtherVouchers()
  }, [])

  return (
    <SidebarInset>
      <div className="h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Voucher</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Area */}
          <div className="flex-1 p-6">
            <Card className="p-6 max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Create New Voucher</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block mb-1 font-medium">
                    Code
                  </label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Voucher Code"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discount_percentage" className="block mb-1 font-medium">
                    Discount Percentage
                  </label>
                  <Input
                    id="discount_percentage"
                    name="discount_percentage"
                    type="number"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                    placeholder="e.g. 15"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="expiry_date" className="block mb-1 font-medium">
                    Expiry Date
                  </label>
                  <Input
                    id="expiry_date"
                    name="expiry_date"
                    type="datetime-local"
                    value={formData.expiry_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  <label htmlFor="is_active">Active</label>
                </div>
                <Button type="submit" className="w-full">
                  Create Voucher
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Other Vouchers</h3>
              <ScrollArea className="h-[800px]">
                {otherVouchers.length === 0 ? (
                  <p>No vouchers available.</p>
                ) : (
                  otherVouchers.map(voucher => (
                    <div
                      key={voucher.voucher_id}
                      className="flex flex-col p-2 border-b border-gray-200"
                    >
                      <span className="font-medium">{voucher.code}</span>
                      <span className="text-sm text-gray-500">
                        Discount: {voucher.discount_percentage}% - Expiry: {new Date(voucher.expiry_date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Status: {voucher.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
