export interface User {
  id: string
  email: string
  name: string
}

export interface Chat {
  id: string
  name: string
  description?: string
  owner: User
  participants: User[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  chat: Chat
  createdAt: string
  updatedAt: Date
}

export interface ChatMessagesResponse {
  content: Message[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
