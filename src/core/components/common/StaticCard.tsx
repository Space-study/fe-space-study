import React, {ReactNode} from 'react'

interface StaticCardProps {
  className?: string
  children: ReactNode
  visible?: boolean
  toggleCard?: () => void
}

export function StaticCard({className = '', children}: StaticCardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`}>
      <div className='w-10 gap-x-2.5'>{children}</div>
    </div>
  )
}
