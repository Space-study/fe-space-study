'use client'

import {roomService} from '@/core/services/user/list-room-service'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@src/core/components/ui/card'
import {ChartContainer, ChartTooltip, ChartTooltipContent} from '@src/core/components/ui/chart'
import * as React from 'react'
import {Label, Pie, PieChart} from 'recharts'

export default function PieChartDonut() {
  const [chartData, setChartData] = React.useState<
    Array<{category: string; count: number; fill: string}>
  >([])
  const [topCategory, setTopCategory] = React.useState('')

  React.useEffect(() => {
    async function fetchRooms() {
      try {
        const dataRooms = await roomService.getAllRooms()
        const categoryCount = dataRooms.reduce((acc: {[key: string]: number}, room) => {
          acc[room.category] = (acc[room.category] || 0) + 1
          return acc
        }, {})

        const transformedData = Object.keys(categoryCount).map((category, index) => ({
          category,
          count: categoryCount[category],
          fill: `hsl(var(--chart-${index + 1}))`, // Adjust colors dynamically
        }))

        setChartData(transformedData)
        const topCategoryEntry = Object.entries(categoryCount).reduce(
          (max, curr) => (curr[1] > max[1] ? curr : max),
          ['', 0],
        )
        setTopCategory(topCategoryEntry[0])
      } catch (err) {
        console.error('Failed to fetch rooms:', err)
      }
    }
    fetchRooms()
  }, [])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  return (
    <Card className='flex flex-col h-full'>
      <CardHeader className='items-center'>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <ChartContainer className='mx-auto h-full' config={{}}>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='category'
              innerRadius={60}
              strokeWidth={5}>
              <Label
                content={({viewBox}) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'>
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'>
                          Categories
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm mt-auto'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Most popular category: {topCategory}
        </div>
        <div className='leading-none text-muted-foreground'>Showing category distribution</div>
      </CardFooter>
    </Card>
  )
}
