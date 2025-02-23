'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {useLatest} from './use-latest'

type WebSocketConfig = {
  url: string
  onMessage?: (event: MessageEvent) => void
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (error: Error) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

export const useWebSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: WebSocketConfig) => {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const latestOnMessage = useLatest(onMessage)
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(() => {
    if (!url) {
      console.error('WebSocket URL is not provided')
      onError?.(new Error('WebSocket URL is not provided'))
      return
    }

    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = event => {
        console.log('WebSocket connected')
        setIsConnected(true)
        reconnectCountRef.current = 0
        onOpen?.(event)
      }

      wsRef.current.onmessage = event => {
        latestOnMessage.current?.(event)
      }

      wsRef.current.onclose = event => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        onClose?.(event)
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++
          console.log(`Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts})`)
          setTimeout(connect, reconnectInterval)
        } else {
          console.error('Max reconnection attempts reached')
          onError?.(new Error('Max reconnection attempts reached'))
        }
      }

      wsRef.current.onerror = event => {
        console.error('WebSocket error:', event)
        onError?.(new Error('WebSocket connection error'))
        wsRef.current?.close()
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      onError?.(error instanceof Error ? error : new Error('Unknown WebSocket error'))
    }
  }, [url, onOpen, onClose, onError, reconnectAttempts, reconnectInterval, latestOnMessage])

  useEffect(() => {
    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [connect])

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
      return true
    }
    return false
  }, [])

  return {sendMessage, isConnected}
}
