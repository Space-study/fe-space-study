import ExamplePageClient from '@/core/components/customer/ExamplePageClient'
import {fetchUsers} from '@src/core/services/example/exampleService'
import React from 'react'

// Server Component
export default async function ExamplePage() {
  const users = await fetchUsers()

  return <ExamplePageClient user={users[0]} />
}
