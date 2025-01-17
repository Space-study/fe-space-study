import {X} from 'lucide-react'
import React, {useState} from 'react'

interface CreateColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateColumn: (title: string) => void
}

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({isOpen, onClose, onCreateColumn}) => {
  const [title, setTitle] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onCreateColumn(title.trim())
      setTitle('')
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Create New Column</h2>
          <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full'>
            <X className='w-5 h-5' />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2'>Column Title</label>
            <input
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter column title...'
              autoFocus
            />
          </div>
          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded'
              disabled={!title.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateColumnModal
