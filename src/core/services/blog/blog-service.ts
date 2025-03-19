import {httpClient} from '@src/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'
import {AxiosError} from 'axios'

// type requestBlog = {
//   title: string
//   category_id: number
//   content: string
//   thumbnail_path: File | null
//   author_id: number
// }

interface responseBlog {
  title: string
  category: string
  thumbnail_path: string
  blog_id: number
  lastname: string
  firstname: string
  status: BlogStatus
  author_id: number
}

enum BlogStatus {
  ACCEPTED = 'accepted',
  NOT_ACCEPTED = 'not accepted',
}

const requestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('blogs')

export class BlogService {
  private readonly requestBuilder = requestBuilder

  public async getAcceptedBlogs(): Promise<{data: responseBlog[] | undefined; status: number}> {
    try {
      const response = await httpClient.get<responseBlog[]>({
        url: this.requestBuilder.buildUrl(''),
      })

      const acceptedBlogs = response.filter(blog => blog.status === BlogStatus.ACCEPTED)

      return {data: acceptedBlogs, status: 200}
    } catch (error) {
      console.error('Error fetching blogs:', error)

      if (error instanceof AxiosError && 'response' in error) {
        return {data: undefined, status: 500}
      }

      throw error
    }
  }

  public async getAllBlogs(): Promise<{data: responseBlog[] | undefined; status: number}> {
    try {
      const response = await httpClient.get<responseBlog[]>({
        url: this.requestBuilder.buildUrl(''),
      })

      return {data: response, status: 200}
    } catch (error) {
      if (error instanceof AxiosError && 'response' in error) {
        console.log('Error fetching blogs:', error.status)
        return {data: undefined, status: 500}
      }

      throw error
    }
  }
}
