import {httpClient} from '@/core/utils/axios'
import {IssueStatus} from '@src/core/enums/issue-status.enum'
import {PaginatedList} from '@src/core/types/paginated-list.type'
import {PaginationParams} from '../../types/pagination-params.type'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

export type Issue = {
  id?: number
  title: string
  description: string
  status: string
  timeEstimate: number
  timeSpent: number
  reporter?: string
  assignee?: string
  project?: string
  participantIds?: number[]
  labelIds?: number[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: string | null
  participants: User[]
  labels: IssueLabel[]
}

export type CreateIssue = {
  title: string
  description: string
  status?: string
  timeEstimate?: number
  timeSpent?: number
  reporterId?: number
  assigneeId?: number
  projectId?: number
  participantIds?: number[]
  labelIds?: number[]
}

export type UpdateIssue = Partial<CreateIssue>

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

export interface Project {
  id: number
  name: string
  description?: string
}

export interface IssueLabel {
  id: number
  name: string
  color: string
}

export interface IssueDetail {
  id: number
  title: string
  description: string
  status: IssueStatus
  timeEstimate: number
  timeSpent: number
  reporter?: User
  assignee?: User | null
  project: Project
  participants: User[]
  labels: IssueLabel[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export class IssueService {
  private static instance: IssueService
  private requestBuilder: IRequestBuilder

  private constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public static getInstance(requestBuilder: IRequestBuilder): IssueService {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService(requestBuilder)
    }
    return IssueService.instance
  }

  public async getPaginatedIssues(params: PaginationParams): Promise<PaginatedList<Issue>> {
    const payload = await httpClient.get<PaginatedList<Issue>>({
      url: this.requestBuilder.buildUrl(),
      config: {params},
    })
    return payload
  }

  public async getIssueById(id: number): Promise<IssueDetail> {
    return await httpClient.get<IssueDetail>({
      url: this.requestBuilder.buildUrl(`${id}`),
    })
  }

  public async getIssuesByProjectId(projectId: number): Promise<Issue[]> {
    return await httpClient.get<Issue[]>({
      url: this.requestBuilder.buildUrl(`project/${projectId}`),
    })
  }

  public async createIssue(issue: CreateIssue): Promise<Issue> {
    return await httpClient.post<Issue, CreateIssue>({
      url: this.requestBuilder.buildUrl(),
      body: issue,
    })
  }

  public async updateIssue(id: number, issue: UpdateIssue): Promise<Issue> {
    return await httpClient.put<Issue, UpdateIssue>({
      url: this.requestBuilder.buildUrl(`${id}`),
      body: issue,
    })
  }

  public async updateIssueStatus(id: number, status: string): Promise<Issue> {
    return await httpClient.put<Issue, {status: string}>({
      url: this.requestBuilder.buildUrl(`status/${id}`),
      body: {status},
    })
  }

  public async deleteIssue(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(`${id}`),
    })
  }
}

const requestBuilder = new RequestBuilder()
requestBuilder.setResourcePath('issues')
export const issueService = IssueService.getInstance(requestBuilder)
