import {ApiSuccessResponse} from '@src/core/types/api.type'
import {apiPath} from '@src/core/utils/api'
import {httpClient} from '@src/core/utils/axios'
import {LoginData} from '@src/core/utils/validation/auth'
const axios = require('axios')

interface LoginResponse {
  token: string
  refreshToken: string
}

export const login = async (payload: LoginData) => {
  // Build the login URL using RequestBuilder. Adjust the path if needed.
  const loginUrl = apiPath('api', 'v1', 'auth', 'email', 'login')

  console.log(loginUrl)

  try {
    const response = await axios.post(loginUrl, {payload})
    // Optionally store the access token for future requests.
    console.log('hello', response.data.token)
    if (response.payload?.token) {
      localStorage.setItem('accessToken', response.payload.token)
      document.cookie = `refreshToken=${response.payload.refreshToken}; path=/;`
      console.log(response)
    }
    console.log(response.payload?.token)
    return response
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}
