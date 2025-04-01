import {httpClient} from '@/core/utils/axios'
import {PaginatedList} from '@src/core/types/paginated-list.type'
import {PaginationParams} from '../../types/pagination-params.type'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

export type Project = {
  id: number
  name: string
  ownerId: number
  roomId: number
  createdAt?: string
  updatedAt?: string
}

export type CreateProject = {
  name: string
  ownerId: number
  roomId: number
}

export type UpdateProject = Partial<CreateProject>

export class ProjectService {
  private static instance: ProjectService
  private requestBuilder: IRequestBuilder

  private constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public static getInstance(requestBuilder: IRequestBuilder): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService(requestBuilder)
    }
    return ProjectService.instance
  }

  public async getPaginatedProjects(params: PaginationParams): Promise<PaginatedList<Project>> {
    const payload = await httpClient.get<PaginatedList<Project>>({
      url: this.requestBuilder.buildUrl(),
      config: {
        params,
      },
    })
    return payload
  }

  public async getProjectsByRoomId(roomId: number): Promise<Project[]> {
    const payload = await httpClient.get<Project[]>({
      url: this.requestBuilder.buildUrl(`room/${roomId}`),
    })
    return payload
  }

  public async getProjectById(id: number): Promise<Project> {
    return await httpClient.get<Project>({
      url: this.requestBuilder.buildUrl(`${id}`),
    })
  }

  public async createProject(project: CreateProject): Promise<Project> {
    return await httpClient.post<Project, CreateProject>({
      url: this.requestBuilder.buildUrl(),
      body: project,
    })
  }

  public async updateProject(id: number, project: UpdateProject): Promise<Project> {
    return await httpClient.put<Project, UpdateProject>({
      url: this.requestBuilder.buildUrl(`${id}`),
      body: project,
    })
  }

  public async deleteProject(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(`${id}`),
    })
  }
}

const requestBuilder = new RequestBuilder()
requestBuilder.setResourcePath('projects')
export const projectService = ProjectService.getInstance(requestBuilder)
