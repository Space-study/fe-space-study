export function CategoryNav() {
  const categories = [
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
    <nav className='overflow-x-auto flex justify-center'>
      <ul className='flex space-x-6 px-4 py-2'>
        {categories.map(category => (
          <li key={category}>
            <a href='#' className='text-gray-600 hover:text-gray-900 transition-colors text-sm'>
              {category}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
