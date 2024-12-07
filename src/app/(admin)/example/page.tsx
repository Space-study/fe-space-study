import ExamplePageClient from '@src/core/pages/customer/ExamplePageClient'
import {fetchUsers} from '@src/core/services/example/exampleService'
import React from 'react'

// Server Component
export default async function ExamplePage() {
  const users = await fetchUsers()

  return <ExamplePageClient users={users} />
}
