import ExamplePageClient from '@/core/components/customer/ExamplePageClient'
import {fetchUsers} from '@src/core/services/example/exampleService'
import React from 'react'

// Server Component
export default async function ExamplePage() {
  const users = await fetchUsers();
  if (!users || users.length === 0) {
    return <div>No users found.</div>;
  }

  return <ExamplePageClient user={users[0]} />
}
