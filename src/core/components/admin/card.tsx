import * as React from 'react'

import {roomService} from '@/core/services/user/list-room-service'
import {Card, CardContent, CardHeader, CardTitle} from '@src/core/components/ui/card'
import {userService} from '@src/core/services/admin/user/user-service'
import {BlogService} from '@src/core/services/blog/blog-service'
import {useEffect, useState} from 'react'

interface StaticData {
  title: string
  value: number
}

const StatsCard = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [totalRooms, setTotalRooms] = useState<number>(0)
  const [totalBlogs, setTotalBlogs] = useState<number>(0)
  const [newUsers, setNewUsers] = useState<number>(0)

  const blogService = new BlogService()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataUsers, dataRooms, dataBlogs] = await Promise.all([
          userService.getAllUsers().catch(err => {
            console.error('Failed to fetch users:', err)
            return []
          }),
          roomService.getAllRooms().catch(err => {
            console.error('Failed to fetch rooms:', err)
            return []
          }),
          blogService.getAllBlogs().catch(err => {
            console.error('Failed to fetch blogs:', err)
            return {data: []}
          }),
        ])
        const count = dataUsers.reduce((acc, user) => {
          if (user.createdAt) {
            const createdAt = new Date(user.createdAt)
            if (createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear) {
              acc++
            }
          }
          return acc
        }, 0)
        setNewUsers(count)
        setTotalUsers(dataUsers.length)
        setTotalRooms(dataRooms.length)
        if (dataBlogs?.data) {
          setTotalBlogs(dataBlogs.data.length)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }

    fetchData()
  }, [])

  const statsData: StaticData[] = [
    {title: 'Total Users', value: totalUsers},
    {title: 'Users New', value: newUsers},
    {title: 'Blog', value: totalBlogs},
    {title: 'Room', value: totalRooms},
  ]
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
