import * as React from 'react'

import {Card, CardContent, CardHeader, CardTitle} from '@src/core/components/ui/card'

interface StaticData {
  title: string
  value: number
}

const statsData: StaticData[] = [
  {title: 'Total Users', value: 5},
  {title: 'Active Learning Spaces', value: 125},
  {title: 'Revenue', value: 25000},
  {title: 'Engagement Rate', value: 75},
]

const StatsCard = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4' {...props}>
      {statsData.map((stat, index) => (
        <Card key={index} className='flex flex-col items-center justify-center p-4'>
          <CardHeader className='p-0 '>
            <CardTitle className='text-sm font-medium text-center'>{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <span className='text-3xl font-bold'>
              {stat.title === 'Revenue'
                ? `$${stat.value.toLocaleString()}`
                : stat.title === 'Engagement Rate'
                  ? `${stat.value}%`
                  : stat.value.toLocaleString()}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsCard
