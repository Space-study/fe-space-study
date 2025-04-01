import type {Message} from '@src/core/store/chat-store'
import {format} from 'date-fns'
import {Check, Clock} from 'lucide-react'
import Image from 'next/image'
import {memo} from 'react'

type MessageListProps = {
  messages: Message[]
}

function MessageListComponent({messages}: MessageListProps) {
  return (
    <div className='flex flex-col gap-4'>
      {messages.map((message, index) => {
        // Check if the message is AI-generated
        const isAiGenerated = message.isAiGenerated

        return (
          <div key={`${message.id || ''}-${index}`} className='flex gap-2 items-start'>
            <div className='h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground'>
              {isAiGenerated ? (
                <Image
                  src='/chatgpt-logo.png'
                  alt='ChatGPT'
                  onError={e => {
                    // Fallback if image fails to load
                    ;(e.target as HTMLImageElement).style.display = 'none'
                    e.currentTarget.parentElement!.textContent = 'AI'
                  }}
                  className='h-full w-full object-cover'
                  width={32}
                  height={32}
                />
              ) : (
                // Display user avatar for regular messages
                <> {message.sender?.avatar || message.sender?.name?.[0] || '?'}</>
              )}
            </div>
            <div className='flex flex-col gap-1  w-[80%] '>
              <div className='text-sm font-medium'>
                {isAiGenerated ? 'Chat GPT' : message.sender?.name || 'Unknown'}
              </div>
              <div
                className={`rounded-lg p-2 text-sm break-words ${isAiGenerated ? 'bg-green-50 border border-green-200' : 'bg-muted'}`}>
                {message.content}
              </div>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                {format(new Date(message.timestamp || Date.now()), 'MMM d, h:mm a')}
                {message.status === 'sending' && <Clock className='h-3 w-3' />}
                {message.status === 'sent' && <Check className='h-3 w-3' />}
                {message.status === 'error' && (
                  <span className='text-destructive'>Failed to send</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const MessageList = memo(MessageListComponent)
