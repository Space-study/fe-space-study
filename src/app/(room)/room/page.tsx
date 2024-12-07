import {ThemeProvider} from '@src/app/shared/ThemeProvider'
import RoomPageClient from '@src/core/pages/customer/RoomPageClient'
import React from 'react'

export default async function RoomPage() {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <RoomPageClient children={<></>} />
    </ThemeProvider>
  )
}
