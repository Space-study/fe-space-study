import {Button} from '@src/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white p-4'>
      <h1 className='text-[200px] font-bold text-gray-900'>404</h1>

      <h2 className='text-xl font-medium text-gray-900 mt-4'>
        Oops 😱, The page you are looking for is not available.
      </h2>

      <p className='text-gray-600 text-center max-w-md mt-4'>
        We are sorry for the inconvenience, The page you are trying to access has been removed or
        never been existed.
      </p>

      <Link href='/' className='mt-8'>
        <Button
          variant='secondary'
          className='text-white px-8 py-2 rounded-md flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='w-5 h-5'>
            <path d='m12 19-7-7 7-7' />
            <path d='M19 12H5' />
          </svg>
          BACK TO HOME
        </Button>
      </Link>
    </div>
  )
}
