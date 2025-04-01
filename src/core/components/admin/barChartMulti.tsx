'use client'

import {userService} from '@src/core/services/admin/user/user-service'
import {useEffect, useState} from 'react'
import {Bar, BarChart, CartesianGrid, LabelList, XAxis} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/core/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@src/core/components/ui/chart'

export default function BarChartMultiple() {
  const [chartData, setChartData] = useState<Array<{month: string; user: number}>>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await userService.getAllUsers()
        const monthCount = users.reduce((acc: {[key: string]: number}, user) => {
          const month = new Date(user.createdAt).toLocaleString('default', {month: 'long'})
          acc[month] = (acc[month] || 0) + 1
          return acc
        }, {})

        const formattedData = Object.entries(monthCount).map(([month, count]) => ({
          month,
          user: count,
        }))
        setChartData(formattedData)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setChartData([])
      }
    }

    fetchUsers()
  }, [])

  const chartConfig = {
    user: {
      label: 'user',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  return (
    <Card className='flex flex-col h-full'>
      <CardHeader>
        <CardTitle>Bar Chart - Users</CardTitle>
        <CardDescription>Monthly User Data</CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{top: 20}}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='user' fill='var(--color-user)' radius={8}>
              <LabelList position='top' offset={12} className='fill-foreground' fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='leading-none text-muted-foreground'>
          Showing total users for the last few months
        </div>
      </CardFooter>
    </Card>
  )
}
