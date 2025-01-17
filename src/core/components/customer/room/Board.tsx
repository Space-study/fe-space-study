import Icon from '@/core/components/customer/room/Icon'
import {Button} from '@/core/components/ui/button'
import React, {
  cloneElement,
  createContext,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {createPortal} from 'react-dom'

interface BoardContextType {
  openName: string
  open: (name: string) => void
  close: () => void
}

interface BoardProps {
  children: ReactNode
}

interface OpenProps {
  children: ReactElement
  opens: string
}

interface WindowProps {
  children: ReactNode
  name: string
  width?: string | number
  height?: string | number
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

const useBoardContext = () => {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('Board components must be used within a BoardProvider')
  }
  return context
}

function Board({children}: BoardProps) {
  const [openName, setOpenName] = useState<string>('')

  const contextValue = {
    openName,
    open: setOpenName,
    close: () => setOpenName(''),
  }

  return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>
}

function Open({children, opens: openWindowName}: OpenProps) {
  const {open} = useBoardContext()

  return cloneElement(children, {
    onClick: (e: ReactMouseEvent) => {
      e.stopPropagation()
      open(openWindowName)
    },
  })
}

function Window({children, name, width = '24rem'}: WindowProps) {
  const {openName, close} = useBoardContext()
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({x: 100, y: 100})
  const [dragging, setDragging] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const dragStartRef = useRef<{x: number; y: number} | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      })
    }

    const handleMouseUp = () => setDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      close()
      setIsClosing(false)
    }, 300)
  }

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setDragging(true)
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }

  if (name !== openName || !mounted) return null

  return createPortal(
    <div
      className='fixed z-50'
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}>
      <div
        className={`bg-slate-700/80 shadow-lg rounded-md transition-all duration-300 ${
          minimized ? 'h-20 w-40' : 'h-96'
        } ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{width}}>
        <div
          className='cursor-move p-2 bg-gray-500 rounded-t-md text-white flex justify-between items-center'
          onMouseDown={handleMouseDown}
          style={{userSelect: 'none'}}>
          <span>Drag Me</span>
          <div className='flex space-x-2'>
            <Button size='icon' variant='ghost' onClick={() => setMinimized(!minimized)}>
              <Icon name={minimized ? 'Maximize' : 'Minimize'} className='h-4 w-4' />
            </Button>
            {!minimized && (
              <Button size='icon' variant='ghost' onClick={handleClose}>
                <Icon name='Close' className='text-white' />
              </Button>
            )}
          </div>
        </div>
        <div className='p-2'>
          {cloneElement(children as ReactElement, {onCloseModal: close, minimized})}
        </div>
      </div>
    </div>,
    document.body,
  )
}

Board.Open = Open
Board.Window = Window

export default Board
