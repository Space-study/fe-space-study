'use client'

import {roomService} from '@/core/services/user/list-room-service'
import RoomPageClient from '@src/core/pages/customer/RoomPageClient'
import {useRouter, useSearchParams} from 'next/navigation'
import React, {useEffect, useState} from 'react'

export default function RoomPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteLink = searchParams.get('inviteLink') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomId = parseInt(window.location.pathname.split('/').pop() || '0', 10)
        if (!roomId) {
          throw new Error('Invalid room ID')
        }

        const roomData = await roomService.getRoomById(roomId)
        if (!roomData) {
          throw new Error('Room not found')
        }

        if (roomData.privacy === 'private') {
          const isValid = await roomService.checkInviteLink(roomId, inviteLink)

          console.log('Invite Link:', isValid.statusCode)
          if (isValid.statusCode !== 200) {
            router.push('/')
            return
          }
        }
      } catch (err) {
        console.error(err)
        setError('Room not found or access denied')
        router.push('/') // Redirect if error
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [inviteLink, router])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return <RoomPageClient />
}
