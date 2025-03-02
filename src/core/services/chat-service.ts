import {httpClient} from '@/core/utils/axios'
import type {Message} from '@src/core/store/chat-store'
import {PaginatedList} from '@src/core/types/paginated-list.type'
import {PaginationParams} from '@src/core/types/pagination-params.type'
import {IRequestBuilder, RequestBuilder} from '@src/core/utils/axios/request-builder'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || ''

interface IMessageService {
  getPaginatedMessages(chatId: string, params: PaginationParams): Promise<PaginatedList<Message>>
  sendMessage(chatId: string, content: string): Promise<void>
  getWebSocketUrl(): string
}

export class ChatService implements IMessageService {
  private static instance: ChatService
  private readonly requestBuilder: IRequestBuilder

  private constructor(requestBuilder: IRequestBuilder) {
    this.requestBuilder = requestBuilder
  }

  public static getInstance(requestBuilder: IRequestBuilder): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService(requestBuilder)
    }
    return ChatService.instance
  }

  public async getPaginatedMessages(
    chatId: string,
    params: PaginationParams,
  ): Promise<PaginatedList<Message>> {
    const url = `${this.requestBuilder.buildUrl(`${chatId}/messages`)}`
    const {payload} = await httpClient.get<PaginatedList<Message>>({
      url,
      config: {params},
    })
    console.log('Messages payload', payload)
    return payload
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async sendMessage(chatId: string, content: string): Promise<void> {
    // This is now just a placeholder method that resolves immediately
    // The actual sending is done via WebSocket in the chat-widget component
    return Promise.resolve()
  }

  public getWebSocketUrl(): string {
    return WS_URL
  }
}
const requestBuilder = new RequestBuilder()
requestBuilder.setResourcePath('chats')

export const chatService = ChatService.getInstance(requestBuilder)
