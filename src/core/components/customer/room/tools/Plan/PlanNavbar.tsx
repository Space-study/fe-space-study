import {useModal} from '@/core/components/customer/room/Modal'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  FolderKanban,
  Layout,
  Maximize2,
  Minus,
  Pencil,
  Users,
} from 'lucide-react'
import React from 'react'

interface NavItem {
  name: string
  icon: React.ReactNode
  isActive: boolean
}

interface PlanNavbarProps {
  className?: string
}

const PlanNavbar: React.FC<PlanNavbarProps> = ({className = ''}) => {
  const {close} = useModal()
  const navItems: NavItem[] = [
    {name: 'Board', icon: <Layout className='w-4 h-4' />, isActive: true},
    {name: 'Calendar', icon: <CalendarDays className='w-4 h-4' />, isActive: false},
    {name: 'Projects', icon: <FolderKanban className='w-4 h-4' />, isActive: false},
  ]

  const handleNavClick = (index: number): void => {
    // Handle navigation click - implement as needed
    console.log(`Clicked nav item ${index}`)
  }

  const handleTodayClick = (): void => {
    // Handle today button click
    console.log('Today clicked')
  }

  const handleNavigationClick = (direction: 'prev' | 'next'): void => {
    // Handle navigation arrow clicks
    console.log(`Navigation ${direction} clicked`)
  }

  return (
    <div className={`w-full border-b border-gray-200 ${className}`}>
      <nav className='flex items-center justify-between px-4 h-12'>
        <ul className='flex space-x-1'>
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavClick(index)}
                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                  item.isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
                type='button'>
                {item.icon}
                <span className='ml-2'>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className='flex items-center space-x-2'>
          {/* Left Block */}
          <div className='flex items-center space-x-2'>
            <button type='button' className='p-2 text-gray-600 hover:bg-gray-100 rounded-md'>
              <Pencil className='w-4 h-4' />
            </button>
            <button type='button' className='p-2 text-gray-600 hover:bg-gray-100 rounded-md'>
              <Clock className='w-4 h-4' />
            </button>
            <button type='button' className='p-2 text-gray-600 hover:bg-gray-100 rounded-md'>
              <Users className='w-4 h-4' />
            </button>
            <div className='flex items-center space-x-1 px-2'>
              <span className='text-gray-600'>3</span>
              <Flame className='w-4 h-4 text-orange-500' />
            </div>
            <button type='button' className='p-2 text-gray-600 hover:bg-gray-100 rounded-md'>
              <Maximize2 className='w-4 h-4' />
            </button>
          </div>

          {/* Right Block */}
          <div className='flex items-center space-x-2 ml-4'>
            <button
              type='button'
              onClick={handleTodayClick}
              className='px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50'>
              Today
            </button>
            <div className='flex items-center space-x-1'>
              <button
                type='button'
                onClick={() => handleNavigationClick('prev')}
                className='p-1.5 text-gray-600 hover:bg-gray-100 rounded-md'>
                <ChevronLeft className='w-4 h-4' />
              </button>
              <button
                type='button'
                onClick={() => handleNavigationClick('next')}
                className='p-1.5 text-gray-600 hover:bg-gray-100 rounded-md'>
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
        <button
          type='button'
          onClick={close}
          className='px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-200 transition duration-200 ease-in-out'>
          <Minus className='w-4 h-4' />
        </button>
      </nav>
    </div>
  )
}

export default PlanNavbar
