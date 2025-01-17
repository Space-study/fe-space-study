import * as React from 'react'

import {Card, CardContent, CardHeader, CardTitle} from '@src/core/components/ui/card'

interface StaticData {
  title: string
  value: number
}

const data: StaticData = {
  title: 'Statics',
  value: 10,
}

export default function StaticsCard(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className='w-full h-full flex flex-col items-center justify-between p-4' {...props}>
      <CardHeader className='p-0 '>
        <CardTitle className='text-sm  font-medium'>{data.title}</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <span className='text-3xl font-bold'>{data.value}</span>
      </CardContent>
    </Card>
  )
}
