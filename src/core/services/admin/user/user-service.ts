import {httpClient} from '@/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'

export interface UserType {
  id: number
  email: string
  provider: string
  socialId: string | null
  firstName: string
  lastName: string
  photo: {
    id?: string
    path: string
  }
  role: {
    id: number
    name: string
  }
  status: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

const requestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('users')

export class UserService {
  private readonly requestBuilder = requestBuilder

  public async getAllUsers(): Promise<UserType[]> {
    try {
      const url = this.requestBuilder.buildUrl()
      const response = await httpClient.get<{payload: UserType[]}>({
        url,
      })
      return response.payload
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  public async getUserById(userId: number): Promise<UserType> {
    try {
      const url = this.requestBuilder.buildUrl(`${userId}`)
      const response = await httpClient.get<UserType>({
        url,
      })
      return response
    } catch (error) {
      console.error('Error fetching user by id:', error)
      throw error
    }
  }

  public async updateUserProfile(userId: number, data: Partial<UserType>): Promise<UserType> {
    const response = await httpClient.patch<UserType, Partial<UserType>>({
      url: this.requestBuilder.buildUrl(`${userId}`),
      body: data,
    })
    return response
  }

  public async updateUserStatus(userId: number, statusId: number): Promise<UserType> {
    const response = await httpClient.patch<UserType, {status: {id: number}}>({
      url: this.requestBuilder.buildUrl(`${userId}`),
      body: {
        status: {id: statusId},
      },
    })
    return response
  }
}

export const userService = new UserService()
