'use client'

import {Toaster} from 'react-hot-toast'
import {MusicForm} from '../music-form'

export default function CreateMusicPage() {
  return (
    <div className='container mx-auto p-4'>
      <Toaster position='top-right' />
      <h1 className='text-2xl font-bold mb-4'>Create New Music</h1>
      <MusicForm />
    </div>
  )
}
