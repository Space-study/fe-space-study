'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@src/core/components/ui/card'
import { Users } from 'lucide-react'
import Image from 'next/image'

export default function RoomCard({
  title,
  online,
  imageUrl,
}: {
  title: string
  online: number
  imageUrl: string
}) {
  return (
    <Card className="hover:shadow-lg">
      <Image
        src={imageUrl || '/images/default.jpg'}
        alt={title}
        width={400}
        height={200}
        className="rounded-t-md object-cover w-full h-48"
      />
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{online} online</span>
        </div>
      </CardContent>
    </Card>
  )
}
