'use client'

// import type React from 'react'

import {MessageList} from '@src/core/components/customer/room/tools/chat/message-list'
import {Alert, AlertDescription, AlertTitle} from '@src/core/components/ui/alert'
import {Button} from '@src/core/components/ui/button'
import {Input} from '@src/core/components/ui/input'
import {useWebSocket} from '@src/core/hooks/use-websocket'
import {useChatStore} from '@src/core/store/chat-store'
import type {Message as ChatMessage} from '@src/core/types/chat-message.type'
import {AlertCircle, Send, Video} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useCallback, useEffect, useRef, useState} from 'react'

export function ChatAdminWidget() {
  const {messages, isOpen, addMessage, clearMessages} = useChatStore()
  const [selectedChat] = useState<string>('8b190b7b-a9ed-465f-91b5-e92250386203')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const token = localStorage.getItem('authToken')

  const {socket, joinChat, leaveChat, sendMessage, getChatMessages, isConnected} = useWebSocket(
    token || '',
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    let mounted = true

    const initializeChat = async () => {
      if (!isOpen || !isConnected) return

      try {
        setError(null)
        await joinChat(selectedChat)

        if (!mounted) return

        const response = await getChatMessages(selectedChat, 1, 50)

        if (!mounted) return

        clearMessages()

        const sortedMessages = [...response.content].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )

        sortedMessages.forEach((msg: ChatMessage) => {
          addMessage({
            id: msg.id,
            content: msg.content,
            sender: {
              id: parseInt(msg.user.id),
              name: `${msg.user.firstName} ${msg.user.lastName}`.trim(),
              avatar: msg.user.avatar,
            },
            timestamp: msg.createdAt,
            status: 'sent',
          })
        })

        scrollToBottom()
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        if (mounted) {
          setError('Failed to connect to chat room. Please try again.')
        }
      }
    }

    initializeChat()

    return () => {
      mounted = false
      if (selectedChat) {
        leaveChat(selectedChat).catch(console.error)
        clearMessages()
      }
    }
  }, [
    isOpen,
    selectedChat,
    isConnected,
    joinChat,
    getChatMessages,
    addMessage,
    clearMessages,
    leaveChat,
    scrollToBottom,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = inputRef.current?.value.trim()
    if (!content || !isConnected) return

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    try {
      await sendMessage(selectedChat, content)
    } catch (error) {
      console.error('Failed to send message:', error)
      setError('Failed to send message. Please try again.')
    }
  }
  const handleStartCall = () => {
    const roomId = '1' // You can generate a unique room ID here
    router.push(`/chat/${roomId}`)
  }

  return (
    <div className='flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b bg-primary/5'>
        <div className='flex w-full items-center justify-between gap-2'>
          <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <Button type='button' variant='outline' onClick={handleStartCall}>
            <Video />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
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

      {/* Input Area */}
      <div className='border-t p-4 bg-white sticky bottom-0'>
        <form onSubmit={handleSubmit}>
          <div className='flex gap-2'>
            <Input
              ref={inputRef}
              placeholder='Type your message...'
              className='flex-1 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary'
              disabled={!socket?.connected}
            />
            <Button
              type='submit'
              size='icon'
              disabled={!socket?.connected}
              className='bg-primary hover:bg-primary/90 text-white rounded-full'>
              <Send className='h-5 w-5' />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
