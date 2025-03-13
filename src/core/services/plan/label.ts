import {httpClient} from '@/core/utils/axios'
import {PaginatedList} from '@src/core/types/paginated-list.type'
import {PaginationParams} from '../../types/pagination-params.type'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

type Label = {
  id: number
  name: string
  description: string
}

type CreateLabel = {
  name: string
  description: string
}

type UpdateLabel = Partial<CreateLabel>

export class LabelService {
  private static instance: LabelService
  private requestBuilder: IRequestBuilder

  private constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public static getInstance(requestBuilder: IRequestBuilder): LabelService {
    if (!LabelService.instance) {
      LabelService.instance = new LabelService(requestBuilder)
    }
    return LabelService.instance
  }

  public async getPaginatedLabels(params: PaginationParams): Promise<PaginatedList<Label[]>> {
    const payload = await httpClient.get<PaginatedList<Label[]>>({
      url: this.requestBuilder.buildUrl(),
      config: {
        params,
      },
    })
    return payload
  }

  public async getLabelById(id: number): Promise<Label> {
    return await httpClient.get<Label>({
      url: this.requestBuilder.buildUrl(`${id}`),
    })
  }

  public async createLabel(label: CreateLabel): Promise<Label> {
    return await httpClient.post<Label, CreateLabel>({
      url: this.requestBuilder.buildUrl(),
      body: label,
    })
  }

  public async updateLabel(id: number, label: UpdateLabel): Promise<Label> {
    return await httpClient.put<Label, UpdateLabel>({
      url: this.requestBuilder.buildUrl(`${id}`),
      body: label,
    })
  }

  public async deleteLabel(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(`${id}`),
    })
  }
}

const requestBuilder = new RequestBuilder()
requestBuilder.setResourcePath('issue-labels')
export const labelService = LabelService.getInstance(requestBuilder)
