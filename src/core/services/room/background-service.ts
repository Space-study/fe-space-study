// src/core/services/background.service.ts

import {httpClient} from '@/core/utils/axios'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

export interface Background {
  background_id: number
  user_create_id: number
  category_id: number
  thumbnail_path: string
  title: string
  description: string
  created_at: string
}

export interface CreateBackgroundDto {
  title: string
  description?: string
  category_id?: number
  user_create_id?: number
  file?: File
}

const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('backgrounds')

export class BackgroundService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public async getAllBackgrounds(): Promise<Background[]> {
    const response = await httpClient.get<Background[]>({
      url: this.requestBuilder.buildUrl(),
    })
    return response
  }

  public async getBackgroundsByUser(userId: number): Promise<Background[]> {
    const response = await httpClient.get<Background[]>({
      url: this.requestBuilder.buildUrl(),
      config: {params: {user_create_id: userId}},
    })
    return response
  }

  public async getBackgroundById(id: number): Promise<Background> {
    const response = await httpClient.get<Background>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
    return response
  }

  public async createBackground(data: CreateBackgroundDto): Promise<Background> {
    const formData = new FormData()
    if (data.file) formData.append('file', data.file)
    if (data.user_create_id) formData.append('user_create_id', String(data.user_create_id))
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    if (data.category_id) formData.append('category_id', String(data.category_id))

    const response = await httpClient.post<Background, FormData>({
      url: this.requestBuilder.buildUrl(),
      body: formData,
      config: {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    })
    return response
  }

  public async updateBackground(
    id: number,
    data: Partial<CreateBackgroundDto>,
  ): Promise<Background> {
    const formData = new FormData()

    if (data.file) formData.append('file', data.file)
    if (data.title) formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    if (data.category_id) formData.append('category_id', String(data.category_id))

    const response = await httpClient.patch<Background, FormData>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: formData,
      config: {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    })

    return response
  }

  public async deleteBackground(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }
}

export const backgroundService = new BackgroundService(requestBuilder)
