import {isUserLoggedIn, logout} from '@src/core/services/auth/auth-service'
import Link from 'next/link'
import {HiOutlineLogout} from 'react-icons/hi'

const Header = () => {
  async function handleLogout() {
    try {
      await logout()
      localStorage.removeItem('authToken')
      document.cookie = 'refreshToken=; Max-Age=0; path=/;'
      window.location.reload()
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }
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
              {/* <li className='relative group'>
                <span className='text-gray-700 hover:text-red-500 cursor-pointer'>Pages</span>
                <ul className='absolute hidden group-hover:block bg-white shadow rounded mt-2'>
                  <li>
                    <Link href='/meetings' className='block px-4 py-2 hover:bg-gray-100'>
                      Upcoming Meetings
                    </Link>
                  </li>
                  <li>
                    <Link href='/meeting-details' className='block px-4 py-2 hover:bg-gray-100'>
                      Meeting Details
                    </Link>
                  </li>
                </ul>
              </li> */}
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
              {isUserLoggedIn() && (
                <li>
                  <button
                    onClick={handleLogout}
                    className='text-gray-700 hover:text-red-500 flex items-center'>
                    <HiOutlineLogout />
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
