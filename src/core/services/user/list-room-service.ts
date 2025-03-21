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

type UpdateRoomDto = Partial<CreateRoomDto>

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
    return await httpClient.post<Room, CreateRoomDto>({
      url: this.requestBuilder.buildUrl(),
      body: data,
    })
  }

  public async updateRoom(id: number, data: UpdateRoomDto): Promise<Room> {
    return await httpClient.patch<Room, UpdateRoomDto>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: data,
    })
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
