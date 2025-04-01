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
  isAiGenerated?: boolean
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
            // Skip if the exact same message ID already exists
            if (message.id && state.messages.some(msg => msg.id === message.id)) {
              return state
            }

            // For messages without IDs, use more careful content matching
            // This is especially important for websocket messages that might come in twice
            const isDuplicate =
              message.id === undefined &&
              state.messages.some(msg => {
                // If both messages have content
                if (msg.content === message.content) {
                  // Same sender and AI status
                  if (
                    msg.sender.id === message.sender.id &&
                    msg.isAiGenerated === message.isAiGenerated
                  ) {
                    // If no timestamps, consider it a duplicate
                    if (!msg.timestamp || !message.timestamp) {
                      return true
                    }

                    // If timestamps are within 10 seconds, consider it a duplicate
                    const msgTime = new Date(msg.timestamp).getTime()
                    const newMsgTime = new Date(message.timestamp).getTime()
                    return Math.abs(msgTime - newMsgTime) < 10000
                  }
                }
                return false
              })

            if (isDuplicate) {
              return state
            }

            // Safe to add the message
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
        partialize: state => ({messages: state.messages.slice(-50)}),
      },
    ),
  ),
)
