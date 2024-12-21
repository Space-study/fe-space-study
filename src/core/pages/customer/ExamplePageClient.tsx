'use client'

import CustomerCard from '@/core/components/common/CustomerCard'
import React from 'react'

interface ExamplePageClientProps {
  users: Array<{
    id: number
    email: string
    username: string
    phone: string
  }>
}

const ExamplePageClient: React.FC<ExamplePageClientProps> = ({users}) => {
  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-bold mb-4'>Users</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {users.map(user => (
          <CustomerCard key={user.id} email={user.email} name={user.username} phone={user.phone} />
        ))}
      </div>
    </div>
  )
}

export default ExamplePageClient
