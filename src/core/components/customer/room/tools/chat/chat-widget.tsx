// 'use client'

// import type React from 'react'

import {useUser} from '@src/app/shared/UserProvider'
import {MessageList} from '@src/core/components/customer/room/tools/chat/message-list'
import {Alert, AlertDescription, AlertTitle} from '@src/core/components/ui/alert'
import {Button} from '@src/core/components/ui/button'
import {Card} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {useWebSocket} from '@src/core/hooks/use-websocket'
import {useChatStore} from '@src/core/store/chat-store'
import type {Message as ChatMessage} from '@src/core/types/chat-message.type'
import {cn} from '@src/lib/utils'
import {AlertCircle, MessageCircle, Send, X} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'

export function ChatWidget() {
  const {messages, isOpen, setIsOpen, addMessage, clearMessages} = useChatStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedChat, setSelectedChat] = useState<string>('60c85e8c-56d8-47ab-8512-4264f92f1404') // Default chat ID
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  const {tokens} = useUser()
  const token = tokens?.token

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
      if (!isOpen || !selectedChat || !isConnected) return

      try {
        setError(null)

        await joinChat(selectedChat)

        if (!mounted) return

        const response = await getChatMessages(selectedChat, 1, 10)

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
    if (!content || !selectedChat || !isConnected) return

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

  const handleClose = useCallback(() => {
    setIsOpen(false)
    clearMessages()
    if (selectedChat) {
      leaveChat(selectedChat).catch(console.error)
    }
  }, [setIsOpen, clearMessages, selectedChat, leaveChat])

  return (
    <div className='fixed bottom-3 right-3 z-50 flex items-end gap-4'>
      <Button
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
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
          <Card className='w-[320px] h-[calc(100vh-60px)] shadow-lg flex flex-col'>
            <div className='flex items-center justify-between border-b p-4 flex-shrink-0'>
              <h2 className='font-semibold'>Chat</h2>
              <Button variant='ghost' size='icon' onClick={handleClose}>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex-1 overflow-y-auto p-4'>
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
            <div className='border-t p-4 flex-shrink-0'>
              <form onSubmit={handleSubmit}>
                <div className='flex gap-2'>
                  <Input
                    ref={inputRef}
                    placeholder='Say something'
                    className='flex-1'
                    disabled={!socket?.connected}
                  />
                  <Button type='submit' size='icon' disabled={!socket?.connected}>
                    <Send className='h-4 w-4' />
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
