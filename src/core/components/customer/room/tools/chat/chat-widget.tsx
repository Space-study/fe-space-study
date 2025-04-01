'use client'

import type React from 'react'

import {useUser} from '@src/app/shared/UserProvider'
import {Alert, AlertDescription, AlertTitle} from '@src/core/components/ui/alert'
import {Button} from '@src/core/components/ui/button'
import {Card} from '@src/core/components/ui/card'
import {Input} from '@src/core/components/ui/input'
import {openai} from '@src/core/config/openai'
import {useWebSocket} from '@src/core/hooks/use-websocket'
import {useChatStore} from '@src/core/store/chat-store'
import type {Message as ChatMessage} from '@src/core/types/chat-message.type'
import {cn} from '@src/lib/utils'
import {AlertCircle, MessageCircle, Send, X} from 'lucide-react'
import {useParams, useSearchParams} from 'next/navigation'
import {useCallback, useEffect, useRef, useState} from 'react'
import {MessageList} from './message-list'

export function ChatWidget() {
  const {messages, isOpen, setIsOpen, addMessage, clearMessages, updateMessageStatus} =
    useChatStore()
  const [selectedChat, setSelectedChat] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [showMentionSuggestion, setShowMentionSuggestion] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({top: 0, left: 0})

  const params = useParams()
  const searchParams = useSearchParams()
  const {user} = useUser()

  useEffect(() => {
    let roomId = params?.roomId || params?.id

    if (!roomId) {
      const roomIdFromQuery = searchParams?.get('roomId')
      if (roomIdFromQuery) {
        roomId = roomIdFromQuery
      }
    }

    if (roomId && roomId !== selectedChat) {
      setSelectedChat(String(roomId))
    } else if (!roomId && !selectedChat) {
      setSelectedChat('1')
    }
  }, [params, searchParams, selectedChat])

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const {joinChat, leaveChat, sendMessage, getChatMessages, isConnected} = useWebSocket(token || '')

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
              id: Number.parseInt(msg.user.id),
              name: `${msg.user.firstName} ${msg.user.lastName}`.trim(),
              avatar: msg.user.avatar,
            },
            timestamp: msg.createdAt,
            status: 'sent',
            isAiGenerated: msg.isAiGenerated || false,
          })
        })

        scrollToBottom()
      } catch {
        if (mounted) {
          setError('Failed to connect to chat room. Please try again.')
        }
      }
    }

    initializeChat()

    return () => {
      mounted = false
      if (selectedChat) {
        leaveChat(selectedChat).catch(() => {})
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
      // Check if message starts with @gpt before sending
      const isGptCommand = content.toLowerCase().startsWith('@gpt')

      const tempMessageId = crypto.randomUUID()
      const currentTimestamp = new Date().toISOString()

      // Create a user message object
      const userMessage = {
        id: `local-${tempMessageId}`,
        content: content,
        sender: {
          id: user?.id || 0,
          name:
            user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : 'You',
          avatar: undefined,
        },
        timestamp: currentTimestamp,
        status: 'sending' as const,
        isAiGenerated: false,
      }

      // Add message to store immediately
      addMessage(userMessage)

      // Need to scroll right away to see the message
      setTimeout(scrollToBottom, 50)

      if (isGptCommand) {
        // Send the user's prompt with isAiGenerated flag as false (user message)
        const prompt = content.slice(4).trim()

        if (prompt) {
          try {
            // Send to server
            await sendMessage(selectedChat, content, false)

            // Update message status
            updateMessageStatus(`local-${tempMessageId}`, 'sent')

            // Handle AI response
            await handleAIResponse(prompt)
          } catch (sendError) {
            console.error('Error sending GPT command:', sendError)
            updateMessageStatus(`local-${tempMessageId}`, 'error')
          }
        }
      } else {
        try {
          // Send regular user message
          await sendMessage(selectedChat, content, false)

          // Update status once sent
          updateMessageStatus(`local-${tempMessageId}`, 'sent')
        } catch (sendError) {
          console.error('Error sending message:', sendError)
          updateMessageStatus(`local-${tempMessageId}`, 'error')
        }
      }

      // Ensure scrolling to bottom
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Send message error:', error)
      setError('Failed to send message. Please try again.')
    }
  }

  const handleAIResponse = async (userMessage: string) => {
    try {
      // Add optimistic AI loading message
      const tempAiMessageId = crypto.randomUUID()
      const currentTimestamp = new Date().toISOString()

      addMessage({
        id: `local-ai-${tempAiMessageId}`, // Use prefix to identify locally generated AI messages
        content: 'Thinking...',
        sender: {
          id: 9999, // Special ID for AI
          name: 'Chat GPT',
          avatar: '/chatgpt-logo.png',
        },
        timestamp: currentTimestamp,
        status: 'sending',
        isAiGenerated: true,
      })

      // Scroll to show loading indicator
      setTimeout(scrollToBottom, 50)

      const completion = await openai.chat.completions.create({
        messages: [{role: 'user', content: userMessage}],
        model: 'gpt-3.5-turbo',
      })

      const aiResponse = completion.choices[0]?.message?.content

      if (aiResponse) {
        // Remove loading message from the local store only
        const updatedMessages = [...messages].filter(m => m.id !== `local-ai-${tempAiMessageId}`)

        // Create new temporary ID for the actual response
        const aiMessageId = crypto.randomUUID()
        const aiResponseTimestamp = new Date().toISOString()

        // Create AI response message object
        const aiMessageObject = {
          id: `local-ai-${aiMessageId}`, // Use prefix to identify locally generated AI messages
          content: aiResponse,
          sender: {
            id: 9999, // Special ID for AI
            name: 'Chat GPT',
            avatar: '/chatgpt-logo.png',
          },
          timestamp: aiResponseTimestamp,
          status: 'sending' as const,
          isAiGenerated: true,
        }

        // Add to updated messages array
        updatedMessages.push(aiMessageObject)

        // Clear and rebuild the messages
        clearMessages()
        for (const msg of updatedMessages) {
          addMessage(msg)
        }

        // Now send the message to the server
        try {
          await sendMessage(selectedChat, aiResponse, true)

          // Update status to sent if we have our local message still in the store
          updateMessageStatus(`local-ai-${aiMessageId}`, 'sent')
        } catch (sendError) {
          console.error('Error sending AI message to server:', sendError)
          // Mark as error in UI
          updateMessageStatus(`local-ai-${aiMessageId}`, 'error')
        }

        // Make sure to scroll to bottom again
        setTimeout(scrollToBottom, 50)
      }
    } catch (error) {
      console.error('AI response error:', error)
      setError('Failed to get AI response')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart || 0

    // Check if the user just typed "@"
    if (value[cursorPos - 1] === '@') {
      // Calculate position for the suggestion popup
      const rect = e.target.getBoundingClientRect()
      const inputStyles = window.getComputedStyle(e.target)
      const lineHeight = Number.parseInt(inputStyles.lineHeight)

      setCursorPosition({
        top: rect.top - lineHeight - 10,
        left: rect.left + cursorPos * 8, // Approximate character width
      })
      setShowMentionSuggestion(true)
    } else if (showMentionSuggestion && !value.includes('@')) {
      // Hide suggestion if there's no @ in the input
      setShowMentionSuggestion(false)
    }
  }

  const handleSelectMention = () => {
    if (inputRef.current) {
      const currentValue = inputRef.current.value
      const cursorPos = inputRef.current.selectionStart || 0

      // Replace the "@" with "@gpt "
      const newValue =
        currentValue.substring(0, cursorPos - 1) + '@gpt ' + currentValue.substring(cursorPos)

      inputRef.current.value = newValue
      inputRef.current.focus()

      // Move cursor to end of inserted text
      const newCursorPos = cursorPos + 3 // "@" -> "@gpt"
      inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
    }
    setShowMentionSuggestion(false)
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
    clearMessages()
    if (selectedChat) {
      leaveChat(selectedChat).catch(() => {})
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
              <div>
                <h2 className='font-semibold'>Chat</h2>
                <div className='text-xs text-muted-foreground'>
                  Room: {selectedChat} {isConnected ? '(Connected)' : '(Disconnected)'}
                </div>
              </div>
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

              {messages.length > 0 ? (
                <MessageList messages={messages} />
              ) : (
                <div className='flex flex-col items-center justify-center h-full text-center text-muted-foreground'>
                  <MessageCircle className='h-10 w-10 mb-2 opacity-30' />
                  <p>Start first group message</p>
                  <p className='text-xs mt-1'>No messages in this chat yet</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
            <div className='border-t p-4 flex-shrink-0'>
              <form onSubmit={handleSubmit}>
                <div className='flex gap-2 relative'>
                  <Input
                    ref={inputRef}
                    placeholder={isConnected ? 'Say something' : 'Connecting...'}
                    className='flex-1'
                    disabled={!isConnected}
                    onChange={handleInputChange}
                  />
                  {showMentionSuggestion && (
                    <div
                      className='absolute bg-white shadow-md rounded-md p-2 z-50'
                      style={{
                        top: `${cursorPosition.top}px`,
                        left: `${cursorPosition.left}px`,
                      }}>
                      <div
                        className='flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer'
                        onClick={handleSelectMention}>
                        <MessageCircle className='h-4 w-4' />
                        <span>@gpt</span>
                      </div>
                    </div>
                  )}
                  <Button type='submit' size='icon' disabled={!isConnected}>
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
