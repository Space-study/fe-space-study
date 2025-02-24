import { apiPath } from '@src/core/utils/api'
import { LoginData } from '@src/core/utils/validation/auth'
import axios from 'axios'


export const login = async (payload: LoginData) => {
  // Build the login URL using RequestBuilder. Adjust the path if needed.
  const loginUrl = apiPath('api', 'v1', 'auth', 'email', 'login')

  console.log(loginUrl)

  try {
    const response = await axios.post(loginUrl, { payload })
    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
