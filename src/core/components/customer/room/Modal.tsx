import React, {ReactNode, cloneElement, createContext, useContext, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import Icon from './Icon'
import ModalButton from './ModalButton'

// Modal context interface for managing modal open/close state
interface ModalContextProps {
  openName: string
  open: (name: string) => void
  close: () => void
}

// Create context for modal management
const ModalContext = createContext<ModalContextProps | undefined>(undefined)

// Add a custom hook to access the modal context
export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a Modal provider')
  }
  return context
}

// Modal component, provides context for modal opening and closing
const Modal: React.FC<{children: ReactNode}> & {
  Open: React.FC<{children: ReactNode; opens: string}>
  Window: React.FC<{name: string; children: ReactNode}>
} = ({children}) => {
  const [openName, setOpenName] = useState<string>('')
  const close = () => setOpenName('') // Close modal function
  const open = setOpenName // Open modal function

  return <ModalContext.Provider value={{openName, open, close}}>{children}</ModalContext.Provider>
}

// Open component, which triggers the modal open event when clicked
const Open: React.FC<{children: ReactNode; opens: string}> = ({children, opens}) => {
  const {open} = useContext(ModalContext)!
  return cloneElement(children as React.ReactElement, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      open(opens) // Trigger opening the specified modal window
    },
  })
}

// Window component, displays modal window when its name matches the openName in context
const Window: React.FC<{name: string; children: ReactNode}> = ({name, children}) => {
  const {openName, close} = useContext(ModalContext)!
  const [isClosing, setIsClosing] = useState(false) // State for managing modal close animation
  const [mounted, setMounted] = useState(false) // State to track if component is mounted

  // Close the modal with animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      close()
      setIsClosing(false)
    }, 500) // Duration of close animation
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (name !== openName && !isClosing) return null // Don't render modal if it's not the open modal

  // Only render the modal on the client side
  if (!mounted) return null

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 w-full h-screen z-50 transition-opacity duration-500 ease-in-out backdrop-blur-sm ${isClosing ? 'opacity-0' : 'opacity-100'} `}>
      <div
        className={`w-[100%] h-[100%] fixed top-1/2 left-1/2 bg-slate-500/70 shadow-slate-800 p-2 rounded-md transition-transform duration-500 ease-in-out ${isClosing ? 'transform scale-0 -translate-x-1/2 -translate-y-1/2' : 'transform scale-100 -translate-x-1/2 -translate-y-1/2'}`}>
        <div className='flex justify-end'>
          <ModalButton
            className='filter-none p-2 hover:bg-red-500 bg-black rounded-md text-white transition-all duration-100 absolute top-1 right-4'
            onClick={handleClose}
            tooltip={'Close'}
            icon={undefined}>
            <Icon name={'Close'} className='!filter-none text-white' />
          </ModalButton>
        </div>
        <div>{cloneElement(children as React.ReactElement, {onCloseModal: close})}</div>
      </div>
    </div>,
    document.body,
  )
}

Modal.Open = Open
Modal.Window = Window

export default Modal
