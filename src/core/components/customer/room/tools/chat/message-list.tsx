import type {Message} from '@src/core/store/chat-store'
import {format} from 'date-fns'
import {Check, Clock} from 'lucide-react'
import {memo} from 'react'

type MessageListProps = {
  messages: Message[]
}

function MessageListComponent({messages}: MessageListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {messages.map(message => (
        <div key={message.id} className='flex gap-2 items-start'>
          <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground'>
            {message.sender.avatar || message.sender.name[0]}
          </div>
          <div className='flex flex-col gap-1'>
            <div className='text-sm font-medium'>{message.sender.name}</div>
            <div className='rounded-lg bg-muted p-2 text-sm'>{message.content}</div>
            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
              {format(new Date(message.timestamp), 'MMM d, h:mm a')}
              {message.status === 'sending' && <Clock className='h-3 w-3' />}
              {message.status === 'sent' && <Check className='h-3 w-3' />}
              {message.status === 'error' && (
                <span className='text-destructive'>Failed to send</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const MessageList = memo(MessageListComponent)
