import {Button} from '@src/core/components/ui/button'
import {ArrowLeft} from 'lucide-react'
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
        <Button className='text-white px-8 py-2 rounded-md flex items-center gap-2'>
          <ArrowLeft />
          BACK TO HOME
        </Button>
      </Link>
    </div>
  )
}
