// import {Avatar, AvatarFallback, AvatarImage} from '@src/components/ui/avatar'
import {Button} from '@src/components/ui/button'
import Link from 'next/link'

const Header = () => {
  const navItems = [
    {href: '/', label: 'Home'},
    {href: '/meetings', label: 'Meetings'},
    {href: '/room', label: 'Room'},
    {href: '/example', label: 'Example Redux'},
    {href: '/blog', label: 'Blog'},
    {href: '/contact', label: 'Contact Us'},
  ]
  return (
    <header className='container shadow sticky top-0 z-50 bg-transparent'>
      <div className='w-screen fixed flex justify-around'>
        <div className='flex inline-flex justify-between items-center py-4 '>
          <Link href='/' className='text-2xl font-bold text-gray-800 text-white'>
            Edu Smart
          </Link>
        </div>
        <div className='flex inline-flex justify-between items-center py-4'>
          <nav className='flex items-center py-4'>
            <ul className='flex space-x-6'>
              {navItems.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className='text-white hover:text-red-500'>
                    {item.label}
                  </Link>
                </li>
                /* <li className='relative group'>
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
              </li> */
              ))}
            </ul>
          </nav>
        </div>
        <div className='flex inline-flex justify-between items-center py-4 rounded-full'>
          <Button variant='ghost'>Login</Button>
          {/* <Button variant='ghost'>
            <Avatar className='w-8 h-8'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className='font-sans'>Username</p>
          </Button>
          <Button variant='ghost'>Logout</Button> */}
        </div>
      </div>
    </header>
  )
}

export default Header
