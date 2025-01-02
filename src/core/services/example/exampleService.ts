import { apiPath } from '@src/core/utils/api/api';

export const fetchUsers = async () => {
  try {
    const url = apiPath('users');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return []; // Return empty array as fallback
  }
};


export const fetchProductById = async (productId: string) => {
  const url = apiPath('products', productId)
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}
