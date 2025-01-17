'use client'

import RoomFilter from './RoomFilter'
import RoomList from './RoomList'
import { useState } from 'react'
import { Button } from '@src/core/components/ui/button'


const roomData = [
    { title: 'Room 1', online: 21, imageUrl: '/images/room1.jpg' },
    { title: 'Room 2', online: 15, imageUrl: '/images/room2.jpg' },
    { title: 'Room 3', online: 30, imageUrl: '/images/room3.jpg' },
    { title: 'Room 4', online: 18, imageUrl: '/images/room2.jpg' },
    { title: 'Room 5', online: 25, imageUrl: '/images/room1.jpg' },
    { title: 'Room 6', online: 10, imageUrl: '/images/room3.jpg' },
    { title: 'Room 7', online: 12, imageUrl: '/images/room2.jpg' },
    { title: 'Room 92', online: 22, imageUrl: '' },
  ]

const ITEMS_PER_PAGE = 6

export default function AdminRooms() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRooms = roomData.filter((room) =>
    room.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="p-4 flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Rooms Management</h1>
      </div>
      <RoomFilter onSearch={setSearchTerm} />
      <div className="h-4"></div>
      <RoomList rooms={paginatedRooms} />
      <div className="flex justify-between items-center mt-auto pt-4 border-t">
        <span>0 of {filteredRooms.length} row(s) selected.</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => handlePageChange(currentPage - 1)}>
            &lt; Previous
          </Button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <Button variant="ghost" onClick={() => handlePageChange(currentPage + 1)}>
            Next &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
