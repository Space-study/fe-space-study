'use client'

import {packageService} from '@/core/services/user/package-service'
import {useUser} from '@src/app/shared/UserProvider'
import {useEffect, useState} from 'react'

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
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const {user} = useUser()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setSelectedPackage({
          id: 0,
          name: 'Starter Plan',
          description: 'This is the most basic package to get you started.',
          price: 99000,
          duration: 1,
          status: 'OPEN',
          createdAt: new Date().toISOString(),
        })

        const data = await packageService.getAllPackages()
        console.log('data', data)

        const openPackages = data.filter(pkg => Number(pkg.status) === 1 || pkg.status === 'OPEN')

        const formattedData: PackageData[] = openPackages.map(pkg => ({
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

    try {
      const res = await fetch('http://localhost:8000/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          packageId: pkg.id,
        }),
      })

      const data = await res.json()

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert('Không tạo được link thanh toán!')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Đã xảy ra lỗi khi tạo thanh toán!')
    }
  }

  return (
    <div style={{padding: '2rem', backgroundColor: '#f4f6f8', minHeight: '100vh'}}>
      <h1 style={{textAlign: 'center', marginBottom: '2rem', fontSize: '2rem'}}>
        Available Packages
      </h1>
      {packages.length === 0 ? (
        <p style={{textAlign: 'center', fontSize: '1.2rem', color: '#555'}}>
          No packages available.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
          {packages.map(pkg => (
            <div
              key={pkg.id}
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
              <h2 style={{margin: '0 0 0.5rem', fontSize: '1.5rem'}}>{pkg.name}</h2>
              <p style={{color: '#555', marginBottom: '1rem'}}>{pkg.description}</p>
              <div style={{marginBottom: '0.5rem', fontWeight: 500}}>
                <span>Price: </span>
                <span style={{color: '#2d9cdb'}}>{pkg.price}</span>(VND)
              </div>
              <div style={{marginBottom: '0.5rem'}}>
                <strong>Duration:</strong> {pkg.duration} month(s)
              </div>
              {/* <div style={{ marginBottom: '0.5rem' }}>
                <strong>Status:</strong>{' '}
                <span style={{ color: pkg.status === 'OPEN' ? 'green' : 'red' }}>{pkg.status}</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1rem' }}>
                <strong>Created at:</strong> {new Date(pkg.createdAt).toLocaleString()}
              </div> */}
              <button
                onClick={() => handleSelectPackage(pkg)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2d9cdb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}>
                Select Package
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedPackage && (
        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            padding: '1rem',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
          <h2>You have selected: {selectedPackage.name}</h2>
          <p>{selectedPackage.description}</p>
        </div>
      )}
    </div>
  )
}
