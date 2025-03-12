'use client'
import { useUser } from '@src/app/shared/UserProvider'
import { LayoutGrid, Mail, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  const { user } = useUser()

  const navItems = [
    {
      title: 'All spaces',
      icon: <LayoutGrid className='h-5 w-5' />,
      href: '/spaces',
    },
    {
      title: 'Newsletter',
      icon: <Mail className='h-5 w-5' />,
      href: '/blog',
    },
  ]

  if (user) {

    navItems.push({
      title: 'My Blogs',
      icon: <Sparkles className='h-5 w-5' />,
      href: '/blog/mine',
    })

    navItems.push({
      title: 'New Blog',
      icon: <Sparkles className='h-5 w-5' />,
      href: '/blog/new',

    })
  }

  return (
    <aside className='fixed left-0 top-0 h-screen w-[240px] border-r bg-white p-4'>
      <div className='mb-8'>
        <Link href='/' className='flex items-center space-x-2'>
          <span className='text-xl font-bold'>FocusHub</span>
        </Link>
      </div>

      <nav>
        <ul className='space-y-2'>
          {navItems.map(item => (
            <li key={item.title}>
              <Link
                href={item.href}
                className='flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
