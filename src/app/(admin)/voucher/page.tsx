'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Voucher, voucherService } from '@src/core/services/admin/user/voucher-service'
import { Button } from '@src/core/components/ui/button'
import { Card } from '@src/core/components/ui/card'
import { SidebarInset, SidebarTrigger } from '@src/core/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@src/core/components/ui/breadcrumb'
import { Separator } from '@src/core/components/ui/separator'

export default function VoucherListPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])

  const fetchVouchers = async () => {
    try {
      const data = await voucherService.getAllVouchers()
      setVouchers(data)
    } catch (error) {
      console.error('Error fetching vouchers:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return
    try {
      await voucherService.deleteVoucher(id)
      alert('Voucher deleted successfully!')
      fetchVouchers()
    } catch (error) {
      console.error('Error deleting voucher:', error)
      alert('Failed to delete voucher.')
    }
  }

  useEffect(() => {
    fetchVouchers()
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
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Vouchers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">All Vouchers</h2>
            <Link href="/voucher/create">
              <Button>Create Voucher</Button>
            </Link>
          </div>

          {vouchers.length === 0 ? (
            <p>No vouchers found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vouchers.map(v => {
                const isActive = v.is_active
                return (
                  <Card key={v.voucher_id} className="p-4">
                    <h3 className="text-xl font-bold">{v.code}</h3>
                    <div className="mt-2">
                      <span className="block text-sm">
                        <strong>Discount:</strong> {v.discount_percentage}%
                      </span>
                      <span className="block text-sm">
  <strong>Expiry:</strong> {new Date(v.expiry_date).toLocaleString()}
</span>

                      <span className="block text-sm">
                        <strong>Status:</strong>{' '}
                        <span className={isActive ? 'text-green-500' : 'text-red-500'}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </span>
                      <span className="block text-sm">
                        <strong>Created:</strong> {new Date(v.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/voucher/edit/${v.voucher_id}`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(v.voucher_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}
