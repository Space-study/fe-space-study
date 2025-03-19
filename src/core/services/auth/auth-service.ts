import {httpClient} from '@src/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'
import {LoginData, RegisterData} from '@src/core/utils/validation/auth'

interface LoginResponse {
  refreshToken: string
  token: string
  tokenExpires: number
  user: User
}

interface User {
  id: number
  email: string
  provider: string
  socialId: string | null
  firstName: string
  lastName: string
  role: Role
  status: Status
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface Role {
  id: number
  name: string
  __entity: string
}

interface Status {
  id: number
  name: string
  __entity: string
}

const requestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('auth')

export class AuthService {
  private readonly requestBuilder = requestBuilder

  public async loginService(
    data: LoginData,
  ): Promise<{data: LoginResponse | undefined; status: number}> {
    try {
      const response = await httpClient.post<LoginResponse, LoginData>({
        url: this.requestBuilder.buildUrl('email/login'),
        body: data,
      })

      return {data: response, status: 200}
    } catch (error) {
      console.error('Error fetching users:', error)

      if (error instanceof Error && 'response' in error) {
        return {data: undefined, status: 500}
      }
      return {data: undefined, status: 500}
    }
  }

  public async confirmEmailToken(hash: string): Promise<void> {
    try {
      const url = this.requestBuilder.buildUrl('email/confirm')
      await httpClient.post<void, {hash: string}>({
        url,
        body: {hash},
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  public async verifyEmailResetPassword(hash: string): Promise<{status: string}> {
    try {
      const url = this.requestBuilder.buildUrl('email/confirm-forgot-password')
      await httpClient.post<void, {hash: string}>({
        url,
        body: {hash},
      })
      return {status: 'success'}
    } catch (error) {
      console.error('Verification failed:', error)
      return {status: 'error'}
    }
  }

  public async resetPassword(data: {password: string; hash: string}): Promise<{status: string}> {
    try {
      const url = this.requestBuilder.buildUrl('reset/password')
      await httpClient.post<void, {password: string; hash: string}>({
        url,
        body: data,
      })
      return {status: 'success'}
    } catch (error) {
      console.error('Password reset failed:', error)
      return {status: 'error'}
    }
  }

  public async register(data: RegisterData): Promise<{status: string}> {
    try {
      const url = this.requestBuilder.buildUrl('email/register')
      await httpClient.post<void, RegisterData>({
        url,
        body: data,
      })
      return {status: 'success'}
    } catch (error) {
      console.error('Registration failed:', error)
      return {status: 'error'}
    }
  }

  public async getMe(): Promise<User> {
    try {
      const url = this.requestBuilder.buildUrl('me')
      const response = await httpClient.get<User>({
        url,
      })
      return response
    } catch (error) {
      console.log('Please Login to continue')
      throw error
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.requestBuilder.buildUrl('logout')
      await httpClient.post<void, object>({
        url,
        body: {},
      })
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    }
  }
}
