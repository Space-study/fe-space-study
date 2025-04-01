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

      socket.on('disconnect', reason => {
        setIsConnected(false)
      })

      socket.on('error', (error: Error) => {
        setIsConnected(false)
      })

      socket.on('connect_error', error => {
        setIsConnected(false)
      })

      socket.on('userJoined', (data: any) => {})

      socket.on('userLeft', (data: any) => {})

      socket.on('newMessage', (message: Message) => {
        try {
          if (!message.id || !message.content) {
            console.warn('Received invalid message', message)
            return
          }

          addMessage({
            id: message.id,
            content: message.content,
            sender: {
              id: parseInt(message.user?.id || '0'),
              name: `${message.user?.firstName || ''} ${message.user?.lastName || ''}`.trim(),
              avatar: message.user?.avatar,
            },
            timestamp: message.createdAt,
            status: 'sent',
            isAiGenerated: message.isAiGenerated || false,
          })
        } catch (err) {
          console.error('Error processing new message', err)
        }
      })
    },
    [addMessage],
  )

  useEffect(() => {
    if (!token) {
      return
    }

    if (!socketRef.current) {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/chats`

      socketRef.current = io(wsUrl, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
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

  const joinChat = useCallback(async (roomId: string) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        return reject(new Error('Socket not connected'))
      }

      socketRef.current.emit('joinRoom', {roomId: Number(roomId)}, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error))
        } else {
          resolve(response)
        }
      })
    })
  }, [])

  const leaveChat = useCallback(async (roomId: string) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        return reject(new Error('Socket not connected'))
      }

      socketRef.current.emit('leaveRoom', {roomId: Number(roomId)}, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error))
        } else {
          resolve(response)
        }
      })
    })
  }, [])

  const sendMessage = useCallback(
    async (roomId: string, content: string, isAiGenerated = false) => {
      return new Promise<Message>((resolve, reject) => {
        if (!socketRef.current) {
          return reject(new Error('Socket not connected'))
        }

        const payload = {roomId: Number(roomId), content, isAiGenerated}

        socketRef.current.emit('sendMessage', payload, (response: any) => {
          if (response?.error) {
            reject(new Error(response.error))
          } else {
            resolve(response)
          }
        })
      })
    },
    [],
  )

  const getChatMessages = useCallback(async (roomId: string, page = 1, limit = 20) => {
    return new Promise<ChatMessagesResponse>((resolve, reject) => {
      if (!socketRef.current) {
        return reject(new Error('Socket not connected'))
      }

      socketRef.current.emit(
        'getRoomMessages',
        {
          roomId: Number(roomId),
          page,
          limit,
        },
        (response: any) => {
          if (response?.error) {
            reject(new Error(response.error))
          } else {
            resolve({
              content: response.messages || [],
              meta: response.pagination || {},
            })
          }
        },
      )
    })
  }, [])

  return {
    socket: socketRef.current,
    joinChat,
    leaveChat,
    sendMessage,
    getChatMessages,
    isConnected,
    setIsConnected,
  }
}
