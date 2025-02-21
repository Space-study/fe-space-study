'use client'

import type React from 'react'

import {MessageList} from '@src/core/components/customer/room/tools/chat/message-list'
import {Alert, AlertDescription, AlertTitle} from '@src/core/components/ui/alert'
import {Button} from '@src/core/components/ui/button'
import {Card} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {useWebSocket} from '@src/core/hooks/use-websocket'
import {chatService} from '@src/core/services/chat-service'
import {Message, useChatStore} from '@src/core/store/chat-store'
import {cn} from '@src/lib/utils'
import {AlertCircle, MessageCircle, Send, X} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'

export function ChatWidget() {
  const {messages, isOpen, setIsOpen, addMessage, updateMessageStatus} = useChatStore()

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  // WebSocket integration
  const {sendMessage, isConnected} = useWebSocket({
    url: chatService.getWebSocketUrl(),
    onMessage: event => {
      const data = JSON.parse(event.data)
      if (data.type === 'MESSAGE_RECEIVED') {
        addMessage({
          content: data.content,
          sender: data.sender,
        })
      }
    },
    onError: error => {
      console.error('WebSocket error:', error)
      setError('Failed to connect to chat server. Please try again later.')
    },
  })

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = inputRef.current?.value.trim()
    if (!content) return

    // Clear input immediately for better UX
    if (inputRef.current) {
      inputRef.current.value = ''
    }

    // Add message optimistically
    const messageId = crypto.randomUUID()
    addMessage({
      content,
      sender: {
        id: 'current-user-id', // Replace with actual user ID
        name: 'You',
      },
    })

    try {
      // Send message through WebSocket if connected, otherwise use REST API
      const sent =
        isConnected &&
        sendMessage({
          type: 'SEND_MESSAGE',
          content,
        })

      if (!sent) {
        // Fallback to REST API if WebSocket is not connected
        await chatService.sendMessage(content)
      }

      updateMessageStatus(messageId, 'sent')
    } catch (error) {
      console.error('Failed to send message:', error)
      updateMessageStatus(messageId, 'error')
      setError('Failed to send message. Please try again.')
    }
  }

  // Load initial messages
  useEffect(() => {
    if (isOpen) {
      chatService
        .getPaginatedMessages({page: 1, limit: 10})
        .then(fetchedMessages => {
          fetchedMessages.content.forEach((msg: Message) => {
            addMessage({
              content: msg.content,
              sender: msg.sender,
            })
          })
        })
        .catch(error => {
          console.error('Failed to fetch messages:', error)
          setError('Failed to load messages. Please try again later.')
        })
    }
  }, [isOpen, addMessage])

  return (
    <div className='fixed bottom-3 right-3 z-50 flex items-end gap-4'>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size='icon'
        className={cn(
          'h-14 w-14 rounded-full shadow-lg bg-white',
          'transition-transform hover:scale-120 hover:bg-gray-300',
        )}>
        <MessageCircle className='h-6 w-6 text-black' />
      </Button>

      <div
        className={cn(
          'transform transition-all duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-[400px]',
        )}>
        {isOpen && (
          <Card className='w-[320px] h-[calc(100vh-60px)] shadow-lg'>
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='font-semibold'>Chat</h2>
              <Button variant='ghost' size='icon' onClick={() => setIsOpen(false)}>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='h-[calc(100vh-120px)] overflow-y-auto p-4'>
              {error && (
                <Alert variant='destructive' className='mb-4'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <MessageList messages={messages} />
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className='border-t p-4'>
              <div className='flex gap-2'>
                <Input
                  ref={inputRef}
                  placeholder='Say something'
                  className='flex-1'
                  disabled={!isConnected}
                />
                <Button type='submit' size='icon' disabled={!isConnected}>
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}
