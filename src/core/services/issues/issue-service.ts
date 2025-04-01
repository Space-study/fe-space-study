import {httpClient} from '@src/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'

interface IssueResponse {
  report_id: number
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
  created_at: string
  updated_at: string
}

interface CreateIssueDto {
  reporter_id: number
  reason_title: string
  reason_description: string
  status: string
}

interface UpdateIssueDto {
  reason_title: string
  reason_description: string
}

const issueRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('report-issue')

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

  public async updateIssue(
    id: number,
    data: UpdateIssueDto,
  ): Promise<{data: IssueResponse | undefined; status: number}> {
    try {
      const response = await httpClient.patch<IssueResponse, UpdateIssueDto>({
        url: this.requestBuilder.buildUrl(`${id}`),
        body: data,
      })

      return {data: response, status: 200}
    } catch (error) {
      console.error('Error updating issue:', error)
      return {data: undefined, status: 500}
    }
  }

  public async statusUpdateIssue(id: number, status: string) {
    try {
      const response = await httpClient.patch<IssueResponse, {status: string}>({
        url: this.requestBuilder.buildUrl(`admin-update/${id}`),
        body: {status},
      })

      return {data: response, status: 200}
    } catch (error) {
      console.error('Error updating issue status:', error)
      return {data: undefined, status: 500}
    }
  }
}
