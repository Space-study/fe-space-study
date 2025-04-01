'use client'

import {type Room, roomService} from '@/core/services/user/list-room-service'
import {Button} from '@src/core/components/ui/button'
import {PlusCircle} from 'lucide-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {RoomList} from './room-list'

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const data = await roomService.getAllRooms()
      setRooms(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch rooms')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await roomService.deleteRoom(id)
      setRooms(rooms.filter(room => room.id !== id))
      toast.success('Room deleted successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete room')
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Rooms Management</h1>
        <Link href='/rooms/create'>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add New Room
          </Button>
        </Link>
      </div>

      <RoomList rooms={rooms} isLoading={isLoading} onDelete={handleDelete} />
    </div>
  )
}
