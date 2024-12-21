import {PaginatedList} from '@src/core/types/paginated-list.type'
import {PaginationParams} from '@src/core/types/pagination-params.type'
import {UserResponse} from '@src/core/types/user.type'
import {httpClient} from '@src/core/utils/api'
import {IRequestBuilder, RequestBuilder} from '@src/core/utils/api/request-builder'

interface IUserService {
  getPaginatedUsers(params: PaginationParams): Promise<PaginatedList<UserResponse>>
}

class UserService implements IUserService {
  private static instance: UserService
  private requestBuilder: IRequestBuilder

  private constructor(requestBuilder: IRequestBuilder) {
    this.requestBuilder = requestBuilder
  }

  public static getInstance(requestBuilder: IRequestBuilder): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(requestBuilder)
    }
    return UserService.instance
  }

  public async getPaginatedUsers(params: PaginationParams): Promise<PaginatedList<UserResponse>> {
    const {payload} = await httpClient.get<PaginatedList<UserResponse>>({
      url: this.requestBuilder.buildUrl(),
      config: {params},
    })
    console.log('payload', payload)
    return payload
  }
}

const requestBuilder = new RequestBuilder()
requestBuilder.setResourcePath('users')
export const userService = UserService.getInstance(requestBuilder)
