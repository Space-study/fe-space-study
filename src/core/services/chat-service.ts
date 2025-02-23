import {httpClient} from '@/core/utils/axios'
import type {Message} from '@src/core/store/chat-store'
import {PaginatedList} from '@src/core/types/paginated-list.type'
import {PaginationParams} from '@src/core/types/pagination-params.type'
import {IRequestBuilder, RequestBuilder} from '@src/core/utils/axios/request-builder'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || ''

interface IMessageService {
  getPaginatedMessages(params: PaginationParams): Promise<PaginatedList<Message>>
  sendMessage(request: Message['content']): Promise<Message['content']>
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

  public async getPaginatedMessages(params: PaginationParams): Promise<PaginatedList<Message>> {
    const {payload} = await httpClient.get<PaginatedList<Message>>({
      url: this.requestBuilder.buildUrl(),
      config: {params},
    })
    console.log('payload', payload)
    return payload
  }

  public async sendMessage(request: Message['content']): Promise<Message['content']> {
    const {payload} = await httpClient.post<Message['content'], Message['content']>({
      url: this.requestBuilder.buildUrl(),
      body: request,
    })
    return payload
  }

  public getWebSocketUrl(): string {
    return WS_URL
  }
}
const requestBuilder = new RequestBuilder()
requestBuilder.setResourcePath('chat')

export const chatService = ChatService.getInstance(requestBuilder)
