import {httpClient} from '@src/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'

interface IssueResponse {
  id: number
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
  createdAt: string
  updatedAt: string
}

interface CreateIssueDto {
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
}

const issueRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('issues')

export class IssueService {
  private readonly requestBuilder = issueRequestBuilder

  public async createIssue(
    data: CreateIssueDto,
  ): Promise<{data: IssueResponse | undefined; status: number}> {
    try {
      const response = await httpClient.post<IssueResponse, CreateIssueDto>({
        url: this.requestBuilder.buildUrl(''),
        body: data,
      })

      return {data: response, status: 200}
    } catch (error) {
      console.error('Error creating issue:', error)
      return {data: undefined, status: 500}
    }
  }

  public async getIssues(): Promise<{data: IssueResponse[] | undefined; status: number}> {
    try {
      const response = await httpClient.get<IssueResponse[]>({
        url: this.requestBuilder.buildUrl(''),
      })

      return {data: response, status: 200}
    } catch (error) {
      console.error('Error fetching issues:', error)
      return {data: undefined, status: 500}
    }
  }
}
