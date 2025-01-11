'use client'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useCallback} from 'react'

const Header = () => {
  const router = useRouter()

  // Clears token from local storage and redirects to login
  const handleLogout = useCallback(() => {
    localStorage.removeItem('accessToken')
    router.push('/login') // Adjust the path as needed
  }, [router])

  return (
    <header className='bg-white shadow sticky top-0 z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-4'>
          <Link href='/' className='text-2xl font-bold text-gray-800'>
            Edu Smart
          </Link>
          <nav>
            <ul className='flex space-x-6'>
              <li>
                <Link href='/' className='text-gray-700 hover:text-red-500'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/meetings' className='text-gray-700 hover:text-red-500'>
                  Meetings
                </Link>
              </li>
              <li>
                <Link href='/room' className='text-gray-700 hover:text-red-500'>
                  Room
                </Link>
              </li>
              <li>
                <Link href='/example' className='text-gray-700 hover:text-red-500'>
                  Example Redux
                </Link>
              </li>
              <li>
                <Link href='/blog' className='text-gray-700 hover:text-red-500'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/contact' className='text-gray-700 hover:text-red-500'>
                  Contact Us
                </Link>
              </li>
              {/* Logout button */}
              <li>
                <button onClick={handleLogout} className='text-gray-700 hover:text-red-500'>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
