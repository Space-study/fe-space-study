import { httpClient } from '@/core/utils/axios'
import { IRequestBuilder, RequestBuilder } from '../../../utils/axios/request-builder'

export interface Voucher {
  voucher_id: number
  code: string
  discount_percentage: number
  expiry_date: string
  is_active: boolean
  created_at: string
}

export interface CreateVoucherDto {
  code: string
  discount_percentage: number
  expiry_date: string
  is_active: boolean
}

export type UpdateVoucherDto = CreateVoucherDto

const requestBuilder: IRequestBuilder = new RequestBuilder()
  .setPrefix('api')
  .setVersion('v1')
  .setResourcePath('voucher')

export class VoucherService {
  private readonly requestBuilder: IRequestBuilder

  constructor(builder: IRequestBuilder) {
    this.requestBuilder = builder
  }

  async getAllVouchers(): Promise<Voucher[]> {
    return await httpClient.get<Voucher[]>({
      url: this.requestBuilder.buildUrl(),
    })
  }

  async getVoucherById(id: number): Promise<Voucher> {
    return await httpClient.get<Voucher>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }

  async createVoucher(data: CreateVoucherDto): Promise<Voucher> {
    return await httpClient.post<Voucher, CreateVoucherDto>({
      url: this.requestBuilder.buildUrl(),
      body: data,
    })
  }

  async updateVoucher(id: number, data: UpdateVoucherDto): Promise<Voucher> {
    return await httpClient.patch<Voucher, UpdateVoucherDto>({
      url: this.requestBuilder.buildUrl(String(id)),
      body: data,
    })
  }

  async deleteVoucher(id: number): Promise<void> {
    await httpClient.delete<void>({
      url: this.requestBuilder.buildUrl(String(id)),
    })
  }
}

export const voucherService = new VoucherService(requestBuilder)
