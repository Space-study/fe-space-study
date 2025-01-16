// import MusicButton from '../PlayMusic/MusicButton';
import BackgroundButton from '@/core/components/customer/room/tools/Background'
// import Logo from './Logo';
import React from 'react'
// import Menus from './Menus';
import Calendar from '@/core/components/customer/room/tools/Calendar'
import Expand from '@/core/components/customer/room/tools/Expand'
import OutRoom from '@/core/components/customer/room/tools/OutRoom'
import SoundModal from '@/core/components/customer/room/tools/Sound/SoundModal'
import Time from '@/core/components/customer/room/tools/Time'
import TodoListContent from '@/core/components/customer/room/tools/TodoList/TodoListContent'
// import YoutubeModal from '../YouTube/YoutubeModal';

const Header: React.FC = () => {
  return (
    <div className='px-9 flex items-center justify-between'>
      {/* Logo */}
      {/* <Logo /> */}

      {/* Right section with multiple controls */}
      <div className='flex items-center justify-end gap-4'>
        <Expand />
        <BackgroundButton />
        {/*<Menus> 
          <MusicButton />
        </Menus> */}
        <SoundModal />
        <Calendar />
        <TodoListContent />
        <Time />
        <OutRoom />
        {/* <YoutubeModal /> */}
      </div>
    </div>
  )
}

export default Header
