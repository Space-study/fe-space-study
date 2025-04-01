'use client'

import {userService} from '@src/core/services/auth/auth'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import {useParams} from 'next/navigation'
import {useEffect, useState} from 'react'

export default function VideoCallPage() {
  const params = useParams()
  const roomId = params.roomId as string
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeCall = async () => {
      try {
        const appID = process.env.NEXT_PUBLIC_ZEGOLIVE_APP_ID || ''
        const serverSecret = process.env.NEXT_PUBLIC_ZEGOLIVE_SERVER_SECRET || ''

        // Get user info from API
        const userProfile = await userService.getProfile()
        const userID = userProfile.id.toString()
        const userName = `${userProfile.firstName} ${userProfile.lastName}`.trim()

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(appID),
          serverSecret,
          roomId,
          userID,
          userName,
        )

        const zp = ZegoUIKitPrebuilt.create(kitToken)
        zp.joinRoom({
          container: document.querySelector('#video-container') as HTMLElement,
          sharedLinks: [
            {
              name: 'Invite Link',
              url:
                window.location.protocol +
                '//' +
                window.location.host +
                window.location.pathname +
                '?roomID=' +
                roomId,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: 'Auto',
          showLayoutButton: true,
        })
      } catch (error) {
        console.error('Failed to start call:', error)
        setError('Failed to start call. Please try again.')
      }
    }

    initializeCall()
  }, [roomId])

  return (
    <div className='h-screen w-full'>
      {error && (
        <div className='fixed top-4 left-4 bg-red-500 text-white p-4 rounded-lg'>{error}</div>
      )}
      <div id='video-container' className='h-full w-full' />
    </div>
  )
}
