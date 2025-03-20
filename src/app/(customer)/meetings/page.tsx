'use client'

import { Room, roomService } from '@/core/services/user/list-room-service'
import MeetingsPage from '@src/core/pages/customer/MeetPageClient'
import { useEffect, useState } from 'react'

interface MeetingData {
  id: number
  image: string
  alt: string
  title: string
  category: string
  status: string
  count: number
  privacy: 'public' | 'private'
  invite_link?: string
}

export default function CustomerPage() {
  const [rooms, setRooms] = useState<MeetingData[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAllRooms();
    
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response: Expected an array");
        }
    
        const formattedData: MeetingData[] = data.map((room: Room) => ({
          id: room.id,
          image: room.imageUrl || "/default.jpg",
          alt: room.name,
          title: room.name,
          category: room.category || "General",
          status: room.status,
          count: room.maxMembers || 0,
          privacy: room.privacy,
          inviteLink: room.invite_link || "",
        }));
    
        setRooms(formattedData);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    

    fetchRooms()
  }, [])

  return <MeetingsPage data={rooms} />
}
