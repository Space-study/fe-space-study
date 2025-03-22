import {Card, CardContent, CardFooter} from '@src/core/components/ui/card'
import {Skeleton} from '@src/core/components/ui/skeleton'

export function BackgroundListSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({length: 8}).map((_, i) => (
        <Card key={i} className='overflow-hidden'>
          <Skeleton className='aspect-video w-full' />
          <CardContent className='p-4'>
            <Skeleton className='h-5 w-3/4 mb-2' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full mt-1' />
            <Skeleton className='h-3 w-1/3 mt-2' />
          </CardContent>
          <CardFooter className='p-4 pt-0 flex justify-between'>
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-20' />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
