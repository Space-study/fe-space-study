import React from 'react';
import ExamplePageClient from '@/core/components/customer/ExamplePageClient';
import { fetchUsers } from '@src/core/services/example/exampleService';

// Server Component
export default async function ExamplePage() {
  const users = await fetchUsers();

  return <ExamplePageClient users={users} />;
}
