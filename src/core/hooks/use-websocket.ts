/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {useChatStore} from '@src/core/store/chat-store'
import {ChatMessagesResponse, Message} from '@src/core/types/chat-message.type'
import {useCallback, useEffect, useRef, useState} from 'react'
import {io, Socket} from 'socket.io-client'

export const useWebSocket = (token: string) => {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const {addMessage} = useChatStore()

  const setupSocketHandlers = useCallback(
    (socket: Socket) => {
      socket.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      socket.on('error', (error: Error) => {
        console.error('Socket error:', error)
        setIsConnected(false)
      })

      socket.on('connect_error', error => {
        console.error('Connection error:', error)
        setIsConnected(false)
      })

      socket.on('userJoined', (data: any) => {})

      socket.on('userLeft', (data: any) => {})

      socket.on('newMessage', (message: Message) => {
        addMessage({
          id: message.id,
          content: message.content,
          sender: {
            id: parseInt(message.user.id),
            name: `${message.user.firstName} ${message.user.lastName}`.trim(),
            avatar: message.user.avatar,
          },
          timestamp: message.createdAt,
          status: 'sent',
        })
      })
    },
    [addMessage],
  )

  useEffect(() => {
    if (!token) return

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL, {
        auth: {
          token,
        },
      })

      setupSocketHandlers(socketRef.current)
    }

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [token, setupSocketHandlers])

  const joinChat = useCallback(async (chatId: string) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        console.error('Socket not connected when trying to join chat')
        return reject(new Error('Socket not connected'))
      }

      socketRef.current.emit('joinChat', {chatId}, (response: any) => {
        if (response?.error) {
          console.error('Error joining chat:', response.error)
          reject(new Error(response.error))
        } else {
          resolve(response)
        }
      })
    })
  }, [])

  const leaveChat = useCallback(async (chatId: string) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject('Socket not connected')

      socketRef.current.emit('leaveChat', {chatId}, (response: any) => {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response)
        }
      })
    })
  }, [])

  const sendMessage = useCallback(async (chatId: string, content: string) => {
    return new Promise<Message>((resolve, reject) => {
      if (!socketRef.current) return reject('Socket not connected')

      socketRef.current.emit('sendMessage', {data: {chatId, content}}, (response: any) => {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response)
        }
      })
    })
  }, [])

  const getChatMessages = useCallback(async (chatId: string, page = 1, limit = 20) => {
    return new Promise<ChatMessagesResponse>((resolve, reject) => {
      if (!socketRef.current) return reject('Socket not connected')

      socketRef.current.emit('getChatMessages', {chatId, page, limit}, (response: any) => {
        if (response.error) {
          reject(response.error)
        } else {
          resolve(response)
        }
      })
    })
  }, [])

  return {
    socket: socketRef.current,
    joinChat,
    leaveChat,
    sendMessage,
    getChatMessages,
    isConnected,
  }
}
