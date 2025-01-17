'use client'

import {Button} from '@/core/components/ui/button'
import {Calendar} from '@/core/components/ui/calendar' // assuming shadcn calendar component
import {Textarea} from '@/core/components/ui/textarea'
import {format, isValid} from 'date-fns'
import {vi} from 'date-fns/locale'
import {useState} from 'react'
import {toast} from 'react-hot-toast'

interface CalendarWithNotesProps {
  minimized?: boolean
}

interface EventMap {
  [date: string]: string
}

export default function CalendarWithNotes({minimized}: CalendarWithNotesProps) {
  const [events, setEvents] = useState<EventMap>({})
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newNote, setNewNote] = useState<string>('')

  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleSelectDate = (date: Date | undefined) => {
    if (!date || !isValid(date)) return
    setSelectedDate(date)
    const formattedDate = format(date, 'yyyy-MM-dd')
    setNewNote(events[formattedDate] || '')
    setIsEditing(false)
  }

  const handleSaveNote = () => {
    if (!selectedDate) return
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    setEvents(prev => ({...prev, [dateKey]: newNote}))
    if (isEditing) {
      toast.success('Đã cập nhật sự kiện!')
    } else {
      toast.success('Đã thêm sự kiện!')
    }

    setNewNote('')
    setIsEditing(false)
  }

  const handleEditNote = () => {
    if (!selectedDate) return
    setIsEditing(true)
  }

  const handleDeleteNote = () => {
    if (!selectedDate) return
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    setEvents(prev => {
      const updatedEvents = {...prev}
      delete updatedEvents[dateKey]
      return updatedEvents
    })
    toast.success('Đã xóa sự kiện!')
    setNewNote('')
    setIsEditing(false)
  }

  if (minimized) return null

  return (
    <div className='flex flex-col md:flex-row gap-6 bg-slate-800 text-white rounded-lg mx-auto'>
      {/* Calendar Section */}
      <div className='w-full md:w-auto max-w-full'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleSelectDate}
          locale={vi}
          className='rounded-md border-slate-700 bg-slate-800'
        />
      </div>

      {/* Notes Section - Only shows after a date is selected */}
      {selectedDate && (
        <div className='w-full md:w-1/2 lg:w-2/3 space-y-4 mt-6 md:mt-0 bg-slate-800 border-l-2 border-slate-700 p-6'>
          <h3 className='text-lg font-medium text-slate-200'>
            Sự kiện cho ngày: {format(selectedDate, 'dd/MM/yyyy')}
          </h3>

          {events[format(selectedDate, 'yyyy-MM-dd')] && !isEditing ? (
            <div className='mt-4'>
              <p className='mb-4 text-slate-300'>{events[format(selectedDate, 'yyyy-MM-dd')]}</p>
              <div className='space-x-2'>
                <Button
                  variant='secondary'
                  onClick={handleEditNote}
                  className='bg-slate-700 hover:bg-slate-600 text-white'>
                  Chỉnh sửa
                </Button>
                <Button
                  variant='destructive'
                  onClick={handleDeleteNote}
                  className='bg-red-600 hover:bg-red-700 text-white'>
                  Xóa
                </Button>
              </div>
            </div>
          ) : (
            <div className='mt-4'>
              <Textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder='Thêm hoặc chỉnh sửa ghi chú cho ngày này'
                className='w-full h-32 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none'
              />
              <Button
                onClick={handleSaveNote}
                className='mt-4 bg-blue-600 hover:bg-blue-700 text-white'>
                {isEditing ? 'Lưu thay đổi' : 'Thêm sự kiện'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
