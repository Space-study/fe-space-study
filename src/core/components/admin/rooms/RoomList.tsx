'use client'

import RoomCard from './RoomCard'

export default function RoomList({
  rooms,
}: {
  rooms: { title: string; online: number; imageUrl: string }[]
}) {
    console.log('RoomList data:', rooms)
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
      {rooms.map((room, index) => (
        <RoomCard key={index} title={room.title} online={room.online} imageUrl={room.imageUrl} />
      ))}
    </div>
  )
}
