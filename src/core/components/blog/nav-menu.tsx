export function NavMenu() {
  const menuItems = [
    'Home',
    'Personal Growth',
    'Productivity',
    'ADHD',
    'Space & Music',
    'Stress & Anxiety',
    'Sleep',
    'Alternatives',
  ]

  return (
    <nav className='overflow-x-auto'>
      <ul className='flex space-x-6 px-4 py-2 min-w-max'>
        {menuItems.map(item => (
          <li key={item}>
            <a href='#' className='text-gray-600 hover:text-gray-900 transition-colors text-sm'>
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
