'use client'

import { Input } from '@src/core/components/ui/input'
import { Button } from '@src/core/components/ui/button'
import { Plus, RefreshCcw, Search } from 'lucide-react'

export default function RoomFilter({ onSearch }: { onSearch: (value: string) => void }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        placeholder="Filter"
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm"
      />
      <div className="flex gap-2">
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
