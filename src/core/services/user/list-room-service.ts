import { httpClient } from '@/core/utils/axios';
import { RequestBuilder, IRequestBuilder } from '../../utils/axios/request-builder';

export interface Room {
  id: number;
  name: string;
  privacy: 'public' | 'private';
  maxMembers: number;
  imageUrl: string;
  category: string;
  status: string;
  createdAt: string;
}

export interface CreateRoomDto {
  name: string;
  privacy: 'public' | 'private';
  maxMembers: number;
  imageUrl?: string;
  category?: string;
}


type UpdateRoomDto = Partial<CreateRoomDto>;

const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('rooms');

export class RoomService {
  private readonly requestBuilder: IRequestBuilder;

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder;
  }

  public async getAllRooms(): Promise<Room[]> {
    return await httpClient.get<Room[]>({
      url: this.requestBuilder.buildUrl(),
    });
  }

  public async getRoomById(id: number): Promise<Room> {
    return await httpClient.get<Room>({
      url: this.requestBuilder.buildUrl(String(id)),
    });
  }

  public async createRoom(data: CreateRoomDto): Promise<Room> {
    return await httpClient.post<Room, CreateRoomDto>({
      url: this.requestBuilder.buildUrl(),
      body: data,
    });
  }

  public async updateRoom(id: number, data: UpdateRoomDto): Promise<Room> {
    return await httpClient.patch<Room, UpdateRoomDto>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: data,
    });
  }

  public async deleteRoom(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(String(id)),
    });
  }
}

export const roomService = new RoomService(requestBuilder);
