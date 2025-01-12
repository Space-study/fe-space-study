import {Button} from '@/core/components/ui/button'

interface ModalButtonProps {
  icon: React.ReactNode
  onClick: () => void
  tooltip?: string
  children?: React.ReactNode
  className?: string
}

function ModalButton({icon, onClick, tooltip, children, className}: ModalButtonProps) {
  return (
    <div className={`relative group inline-block ${className}`}>
      <Button
        onClick={onClick}
        className='flex items-center justify-center bg-transparent border-none shadow-none'>
        <span>{icon}</span>
        {children}
      </Button>

      {tooltip && (
        <span className='drop-shadow-xl absolute w-[7rem] text-center text-xs left-1/2 filter-green-glow -translate-x-1/2 top-[110%] text-white py-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          {tooltip}
        </span>
      )}
    </div>
  )
}

export default ModalButton
