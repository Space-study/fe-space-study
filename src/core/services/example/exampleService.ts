import {apiPath} from '@src/core/utils/api'

export const fetchUsers = async () => {
  const url = apiPath('users')
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export const fetchProductById = async (productId: string) => {
  const url = apiPath('products', productId)
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}
