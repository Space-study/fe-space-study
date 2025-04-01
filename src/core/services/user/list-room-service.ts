import {httpClient} from '@/core/utils/axios'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

export interface Room {
  id: number
  name: string
  privacy: 'public' | 'private'
  maxMembers: number
  imageUrl: string
  category: string
  status: string
  createdAt: string
  invite_link?: string
}

export interface CreateRoomDto {
  name: string
  privacy: 'public' | 'private'
  maxMembers: number
  imageUrl?: string
  category?: string
  status: 'active' | 'inactive' | 'pending'
  file?: File
}

export interface JoinRoomDto {
  id: number
  userId: number
  inviteLink?: string
}

export interface JoinStateDto {
  statusCode: number
  message: string
}

const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('rooms')

export class RoomService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public async getAllRooms(): Promise<Room[]> {
    return await httpClient.get<Room[]>({
      url: this.requestBuilder.buildUrl(),
    })
  }

  public async getRoomById(id: number): Promise<Room> {
    return await httpClient.get<Room>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }

  public async createRoom(data: CreateRoomDto): Promise<Room> {
    const formData = new FormData()

    // Append all non-file fields
    formData.append('name', data.name)
    formData.append('privacy', data.privacy)
    formData.append('maxMembers', String(data.maxMembers))
    if (data.category) formData.append('category', data.category)
    formData.append('status', data.status)
    if (data.file) formData.append('file', data.file)

    const response = await httpClient.post<Room, FormData>({
      url: this.requestBuilder.buildUrl(),
      body: formData,
      config: {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    })
    return response
  }

  public async updateRoom(id: number, data: CreateRoomDto): Promise<Room> {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('privacy', data.privacy)
    formData.append('maxMembers', String(data.maxMembers))
    if (data.category) formData.append('category', data.category)
    formData.append('status', data.status)
    if (data.file) formData.append('file', data.file)

    const response = await httpClient.patch<Room, FormData>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: formData,
      config: {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    })
    return response
  }

  public async deleteRoom(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }

  public async joinRoom(data: JoinRoomDto): Promise<Room> {
    try {
      const response = await httpClient.post<Room, JoinRoomDto>({
        url: this.requestBuilder.buildUrl(`${data.id}/join`),
        body: data,
      })

      return response
    } catch (error) {
      console.error('Error joining room:', error)

      // if (error.response?.status === 403) {
      //   throw new Error('Invalid invite link or no permission to join')
      // }

      throw new Error('Failed to join room')
    }
  }

  public async checkInviteLink(id: number, inviteLink: string): Promise<JoinStateDto> {
    try {
      const response = await httpClient.post<JoinStateDto, void>({
        url: this.requestBuilder.buildUrl(
          `${id}/join?inviteLink=${encodeURIComponent(inviteLink)}`,
        ),
        body: undefined,
      })

      console.log('Check Invite Link:', response)
      return response
    } catch (error) {
      console.error('Error checking invite link:', error)
      return {statusCode: 500, message: 'Failed to check invite link'}
    }
  }
}

export const roomService = new RoomService(requestBuilder)
