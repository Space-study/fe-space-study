'use client'

import { useEffect, useState } from 'react'
import { packageService } from '@/core/services/user/package-service'
import { useUser } from '@src/app/shared/UserProvider'

interface PackageData {
  id: number
  name: string
  description: string
  price: number
  duration: number
  status: 'OPEN' | 'LOCKED'
  createdAt: string
}

export default function PackagePage() {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [voucherCode, setVoucherCode] = useState('')
  const { user } = useUser()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packageService.getAllPackages()
        const openPackages = data.filter(
          (pkg) => Number(pkg.status) === 1 || pkg.status === 'OPEN'
        )

        const formattedData: PackageData[] = openPackages.map((pkg) => ({
          id: pkg.package_id,
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          duration: pkg.duration,
          status: Number(pkg.status) === 1 ? 'OPEN' : 'LOCKED',
          createdAt: pkg.created_at,
        }))

        setPackages(formattedData)
      } catch (error) {
        console.error('Failed to fetch packages:', error)
      }
    }

    fetchPackages()
  }, [])

  const handleSelectPackage = async (pkg: PackageData) => {
    const userEmail = user?.email
    const userId = user?.id

    if (!userEmail || !userId) {
      alert('Please login before purchasing.')
      return
    }

    try {
      localStorage.setItem(
        'selected_package',
        JSON.stringify({ user_id: userId, package_id: pkg.id })
      )

      const res = await fetch('http://localhost:8000/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          packageId: pkg.id,
          voucherCode: voucherCode.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert(data.message || 'Failed to create payment link.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Error while creating payment.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Available Packages</h1>

      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Enter voucher code"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400 bg-white"
        />
      </div>

      {packages.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No packages available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-600">{pkg.name}</h2>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Price:</strong> {pkg.price} VND
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Duration:</strong> {pkg.duration} month(s)
                </div>
              </div>
              <button
                onClick={() => handleSelectPackage(pkg)}
                className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
              >
                Select Package
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
