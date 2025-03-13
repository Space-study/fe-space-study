import {httpClient} from '@src/core/utils/axios'
import {IRequestBuilder, RequestBuilder} from '@src/core/utils/axios/request-builder'

type Blog = {
  title: string
  category: string
  thumbnail_path: string
  blog_id: number
  lastname: string
  firstname: string
}

const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('blog')

export class BlogService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public async getAllBlogs(): Promise<Blog[]> {
    const response = await httpClient.get<Blog[]>({
      url: this.requestBuilder.buildUrl(),
    })
    return response
  }

  public async getBlogById(id: number): Promise<Blog> {
    const response = await httpClient.get<Blog>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
    return response
  }
}

export const blogService = new BlogService(requestBuilder)
