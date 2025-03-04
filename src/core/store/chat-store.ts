import {create} from 'zustand'
import {devtools, persist} from 'zustand/middleware'

export type Message = {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  status: 'sending' | 'sent' | 'error'
}

type ChatStore = {
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void
  updateMessageStatus: (id: string, status: Message['status']) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      set => ({
        messages: [],
        isOpen: false,
        setIsOpen: open => set({isOpen: open}),
        addMessage: message =>
          set(state => ({
            messages: [
              ...state.messages,
              {
                ...message,
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                status: 'sending',
              },
            ],
          })),
        updateMessageStatus: (id, status) =>
          set(state => ({
            messages: state.messages.map(msg => (msg.id === id ? {...msg, status} : msg)),
          })),
      }),
      {
        name: 'chat-storage',
        partialize: state => ({messages: state.messages}),
      },
    ),
  ),
)
