import {httpClient} from '@src/core/utils/axios'
import {IRequestBuilder, RequestBuilder} from '@src/core/utils/axios/request-builder'
import {LoginData, RegisterData} from '@src/core/utils/validation/auth'

interface LoginResponse {
  refreshToken: string
  token: string
  tokenExpires: number
  user: {
    id: number
    email: string
    provider: string
    socialId: string | null
    firstName: string
    lastName: string
    role: {
      id: number
      name: string
      __entity: string
    }
    status: {
      id: number
      name: string
      __entity: string
    }
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}

const requestBuilder: IRequestBuilder = new RequestBuilder()

export class AuthService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public async login(data: LoginData): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse, LoginData>({
      url: this.requestBuilder.buildUrl('login'),
      body: data,
    })
    return response
  }

  public async register(data: RegisterData): Promise<any> {
    const response = await httpClient.post<any, RegisterData>({
      url: this.requestBuilder.buildUrl('register'),
      body: data,
    })
    return response
  }
}
