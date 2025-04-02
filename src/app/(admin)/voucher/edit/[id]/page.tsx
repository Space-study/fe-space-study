'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function EditVoucherPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: '',
    is_active: true,
  })
  const [otherVouchers, setOtherVouchers] = useState<Voucher[]>([])

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const voucher = await voucherService.getVoucherById(Number(id))
        setFormData({
          code: voucher.code,
          discount_percentage: voucher.discount_percentage.toString(),
          expiry_date: formatDateTimeLocal(new Date(voucher.expiry_date)),
          is_active: voucher.is_active,
        })
      } catch (error) {
        console.error('Failed to load voucher:', error)
      }
    }

    const fetchOther = async () => {
      try {
        const data = await voucherService.getAllVouchers()
        setOtherVouchers(data.filter(v => v.voucher_id !== Number(id)))
      } catch (error) {
        console.error('Failed to fetch vouchers:', error)
      }
    }

    fetchVoucher()
    fetchOther()
  }, [id])

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

      await voucherService.updateVoucher(Number(id), {
        ...formData,
        discount_percentage: parseFloat(formData.discount_percentage),
        expiry_date: expDate.toISOString(),
      })

      alert('Voucher updated successfully!')
      router.push('/voucher')
    } catch (error) {
      console.error('Update failed:', error)
      alert('Failed to update voucher.')
    }
  }
  function formatDateTimeLocal(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
  
    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
  
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
  

  return (
    <SidebarInset>
      <div className="h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Voucher</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Area */}
          <div className="flex-1 p-6">
            <Card className="p-6 max-w-lg mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Edit Voucher</h2>
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
                  Update Voucher
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
                  <p>No other vouchers available.</p>
                ) : (
                  otherVouchers.map(voucher => (
                    <div key={voucher.voucher_id} className="p-2 border-b">
                      <div className="font-medium">{voucher.code}</div>
                      <div className="text-sm text-gray-500">
                        Discount: {voucher.discount_percentage}% - Expiry: {new Date(voucher.expiry_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">Status: {voucher.is_active ? 'Active' : 'Inactive'}</div>
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
