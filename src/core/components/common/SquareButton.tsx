import React, {ComponentType, SVGProps} from 'react'

interface SquareButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label?: string
  onClick: () => void
  children?: React.ReactNode
  className?: string
  color?: string
}

interface IconButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  onClick: () => void
  className?: string
  color?: string
}

interface ThemedButtonProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  label?: string
  onClick: () => void
  className?: string
  disabled?: boolean
}

export const SquareButton: React.FC<SquareButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className = '',
  color = 'text-gray-500',
}) => (
  <button
    className={`w-full aspect-[1] flex flex-col justify-center transition-all duration-200 gap-[5px] text-inherit ${className}`}
    onClick={onClick}>
    <Icon className={`h-5 aspect-square text-xl ${color}`} />
    <span className='whitespace-nowrap text-xs mt-1'>{label}</span>
  </button>
)

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  className = '',
  color = 'text-blue-500',
}) => (
  <button
    className={`icon-btn p-2 bg-transparent border-0 hover:bg-blue-500 rounded-full ${className}`}
    onClick={onClick}>
    <Icon className={`text-2xl ${color} hover:text-white`} />
  </button>
)

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className = '',
  disabled = false,
}) => (
  <button
    disabled={disabled}
    className={`themed-btn p-2 bg-blue-500 text-white rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    onClick={onClick}>
    {!!Icon && <Icon className='h-5 aspect-square text-2xl mr-2' />}
    {!!label && <div className='whitespace-nowrap'>{label}</div>}
  </button>
)
