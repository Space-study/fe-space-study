import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'

export type Message = {
  id?: string
  chatId?: string
  content: string
  sender: {
    id: number
    name: string
    avatar?: string
  }
  timestamp?: string
  status?: 'sending' | 'sent' | 'error'
}

type ChatStore = {
  messages: Message[]
  addMessage: (message: Message) => void
  updateMessageStatus: (id: string, status: Message['status']) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      set => ({
        messages: [],
        isOpen: false,
        setIsOpen: open => set({isOpen: open}),
        addMessage: message =>
          set(state => {
            // Check if message with same ID already exists
            const messageExists = state.messages.some(
              msg =>
                msg.id === message.id ||
                (msg.id?.includes(message.id || '') && msg.content === message.content),
            )

            if (messageExists) {
              return state // Don't add if message already exists
            }

            return {
              messages: [
                ...state.messages,
                {
                  ...message,
                  id: message.id || crypto.randomUUID(),
                  timestamp: message.timestamp || new Date().toISOString(),
                  status: message.status || 'sending',
                },
              ],
            }
          }),
        updateMessageStatus: (id, status) =>
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === id ? {...msg, status, timestamp: new Date().toISOString()} : msg,
            ),
          })),
        clearMessages: () => set({messages: []}),
      }),
      {
        name: 'chat-storage',
        partialize: state => ({messages: state.messages.slice(-50)}), // Keep only last 50 messages
      },
    ),
  ),
)
