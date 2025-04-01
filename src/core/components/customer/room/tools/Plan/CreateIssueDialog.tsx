import {Button} from '@/core/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/core/components/ui/dialog'
import {Input} from '@/core/components/ui/input'
import {Textarea} from '@/core/components/ui/textarea'
import {Plus} from 'lucide-react'
import React from 'react'
import {useForm} from 'react-hook-form'

interface CreateIssueDialogProps {
  columnId: string
  onCreateIssue: (title: string, description: string) => void
}

interface FormData {
  title: string
  description: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({columnId, onCreateIssue}) => {
  const [open, setOpen] = React.useState(false)
  const {register, handleSubmit, reset} = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    onCreateIssue(data.title, data.description)
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='w-full flex items-center justify-center text-gray-600 hover:bg-gray-200'>
          <Plus className='w-4 h-4 mr-1' />
          Add issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Input placeholder='Issue title' {...register('title', {required: true})} />
          </div>
          <div>
            <Textarea
              placeholder='Issue description'
              {...register('description', {required: true})}
              rows={4}
            />
          </div>
          <Button type='submit' className='w-full'>
            Create Issue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
