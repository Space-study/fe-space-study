import {Message} from '@src/core/store/chat-store'
import {format} from 'date-fns'
import {AlertCircle, Check, Clock} from 'lucide-react'
import {memo} from 'react'

type MessageListProps = {
  messages: Message[]
}

function MessageListComponent({messages}: MessageListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {messages.map((message, index) => (
        <div key={`${message.id || ''}-${index}`} className='flex gap-3 items-center'>
          <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground'>
            {message.sender?.avatar || message.sender?.name?.[0] || '?'}
          </div>
          <div className='flex flex-col gap-1 flex-1'>
            <div className='flex items-center gap-2'>
              <div className='text-sm font-medium'>{message.sender?.name || 'Unknown'}</div>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                {message.timestamp && format(new Date(message.timestamp), 'MMM d, h:mm a')}
                {message.status === 'sending' && <Clock className='h-3 w-3' />}
                {message.status === 'sent' && <Check className='h-3 w-3' />}
                {message.status === 'error' && (
                  <span className='text-destructive flex items-center gap-1'>
                    <AlertCircle className='h-3 w-3' />
                    Failed to send
                  </span>
                )}
              </div>
            </div>
            <div className='rounded-lg bg-muted p-3 text-sm break-words'>{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const MessageList = memo(MessageListComponent)
