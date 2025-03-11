"use client"

import { useEffect, useState } from 'react';
import MeetingsPage from '@src/core/pages/customer/MeetPageClient';
import { roomService } from '@/core/services/user/list-room-service';

interface MeetingData {
  image: string;
  alt: string;
  title: string;
  category: string;
  status: string;
  count: number;
}

export default function CustomerPage() {
  const [rooms, setRooms] = useState<MeetingData[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getAllRooms();
        console.log("data", data)
        const formattedData: MeetingData[] = data.map(room => ({
          image: room.imageUrl || '/default.jpg',
          alt: room.name,
          title: room.name,
          category: room.category || 'General',
          status: room.status,
          count: room.maxMembers,
        }));
        setRooms(formattedData);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  return <MeetingsPage data={rooms} />;
}
