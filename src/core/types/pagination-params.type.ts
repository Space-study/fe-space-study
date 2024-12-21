import {OrderDirection} from '@src/core/enums/order-direction.enum'

export type PaginationParams = Partial<{
  skip: number
  page: number
  limit: number
  orderBy: string
  orderDirection: OrderDirection
  searchBy: string
  searchValue: string
}>
