// src/core/services/music.service.ts
import {httpClient} from '@/core/utils/axios'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

export interface Music {
  id: number
  user_create_id: number
  category_id: number
  path: string
  title: string
  createdAt: string
}

export interface CreateMusicDto {
  title: string
  category_id?: number
  path: string
}

type UpdateMusicDto = Partial<CreateMusicDto>

// Initialize RequestBuilder
const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('music')

export class MusicService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public async getAllMusic(): Promise<Music[]> {
    const response = await httpClient.get<Music[]>({
      url: this.requestBuilder.buildUrl(),
    })
    return response
  }

  public async getMusicByUser(userId: number): Promise<Music[]> {
    const response = await httpClient.get<Music[]>({
      url: this.requestBuilder.buildUrl(),
      config: {params: {user_create_id: userId}},
    })
    return response
  }

  public async getMusicById(id: number): Promise<Music> {
    const response = await httpClient.get<Music>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
    return response
  }

  public async createMusic(data: CreateMusicDto): Promise<Music> {
    const response = await httpClient.post<Music, CreateMusicDto>({
      url: this.requestBuilder.buildUrl(),
      body: data,
    })
    return response
  }

  public async updateMusic(id: number, data: UpdateMusicDto): Promise<Music> {
    const response = await httpClient.patch<Music, UpdateMusicDto>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: data,
    })
    return response
  }

  public async deleteMusic(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }
}

export const musicService = new MusicService(requestBuilder)
