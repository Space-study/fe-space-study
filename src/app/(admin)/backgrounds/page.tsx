import {Plus} from 'lucide-react'
import Link from 'next/link'
import {Suspense} from 'react'

import {Button} from '@src/core/components/ui/button'
import {BackgroundList} from './background-list'
import {BackgroundListSkeleton} from './background-list-skeleton'

export default function BackgroundsPage() {
  return (
    <div className='container py-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Backgrounds</h1>
          <p className='text-muted-foreground'>Manage your background images collection</p>
        </div>
        <Link href='/backgrounds/new'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add Background
          </Button>
        </Link>
      </div>

      <Suspense fallback={<BackgroundListSkeleton />}>
        <BackgroundList />
      </Suspense>
    </div>
  )
}
