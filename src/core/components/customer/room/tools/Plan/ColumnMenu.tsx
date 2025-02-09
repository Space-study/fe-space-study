import {useOnClickOutside} from '@/core/hooks/useOnClickOutside'
import {Edit2, MoreVertical, Trash2} from 'lucide-react'
import React, {useRef, useState} from 'react'

interface ColumnMenuProps {
  columnId: string
  onEditColumn: (columnId: string, newTitle: string) => void
  onDeleteColumn: (columnId: string) => void
}

export const ColumnMenu: React.FC<ColumnMenuProps> = ({columnId, onEditColumn, onDeleteColumn}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(menuRef, () => setIsOpen(false))

  const handleEdit = () => {
    setIsEditing(true)
    setIsOpen(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      onDeleteColumn(columnId)
    }
    setIsOpen(false)
  }

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim()) {
      onEditColumn(columnId, newTitle.trim())
      setNewTitle('')
      setIsEditing(false)
    }
  }

  return (
    <div ref={menuRef} className='relative'>
      <button onClick={() => setIsOpen(!isOpen)} className='p-1 hover:bg-gray-200 rounded'>
        <MoreVertical className='w-4 h-4 text-gray-500' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10'>
          <div className='py-1'>
            <button
              onClick={handleEdit}
              className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
              <Edit2 className='w-4 h-4 mr-2' />
              Edit Column
            </button>
            <button
              onClick={handleDelete}
              className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>
              <Trash2 className='w-4 h-4 mr-2' />
              Delete Column
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h2 className='text-lg font-semibold mb-4'>Edit Column Title</h2>
            <form onSubmit={handleSubmitEdit}>
              <input
                type='text'
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className='w-full p-2 border rounded mb-4'
                placeholder='Enter new column title...'
                autoFocus
              />
              <div className='flex justify-end space-x-2'>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded'
                  disabled={!newTitle.trim()}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
