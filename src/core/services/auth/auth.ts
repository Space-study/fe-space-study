import {httpClient} from '@/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'

export interface ProfileType {
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
  password: string
  oldPassword: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

const requestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('auth')

export class ProfileService {
  private readonly requestBuilder = requestBuilder

  public async getProfile(): Promise<ProfileType> {
    try {
      const url = this.requestBuilder.buildUrl(`me`)
      const response = await httpClient.get<ProfileType>({
        url,
      })
      return response
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  public async updateProfile(data: Partial<ProfileType>): Promise<ProfileType> {
    const response = await httpClient.patch<ProfileType, Partial<ProfileType>>({
      url: this.requestBuilder.buildUrl(`me`),
      body: data,
    })
    return response
  }
  public async resetPassword(password: string, token: string): Promise<void> {
    try {
      const url = this.requestBuilder.buildUrl(`reset/password`)
      await httpClient.post<void, {password: string; hash: string}>({
        url,
        body: {
          password,
          hash: token,
        },
      })
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }
}

export const userService = new ProfileService()
