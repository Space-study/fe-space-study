import {httpClient} from '@/core/utils/axios'
import {IRequestBuilder, RequestBuilder} from '../../utils/axios/request-builder'

export interface Package {
  package_id: number
  name: string
  description: string
  price: number
  duration: number
  created_at: string
  status: 'OPEN' | 'LOCKED'
}

export interface CreatePackageDto {
  name: string
  description: string
  price: number
  duration: number
  status?: number
}

export type UpdatePackageDto = Omit<CreatePackageDto, 'status'> & {
  status: number
}

const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('package')

export class PackageService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  public async getAllPackages(): Promise<Package[]> {
    return await httpClient.get<Package[]>({
      url: this.requestBuilder.buildUrl(),
    })
  }

  public async getPackageById(id: number): Promise<Package> {
    return await httpClient.get<Package>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }

  public async createPackage(data: CreatePackageDto): Promise<Package> {
    return await httpClient.post<Package, CreatePackageDto>({
      url: this.requestBuilder.buildUrl(),
      body: data,
    })
  }

  public async updatePackage(id: number, data: UpdatePackageDto): Promise<Package> {
    return await httpClient.patch<Package, UpdatePackageDto>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: data,
    })
  }

  public async deletePackage(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }
}

export const packageService = new PackageService(requestBuilder)
