import {ApiSuccessResponse} from '@/core/types/api.type'
import {LoginResponse} from '@/core/types/auth.type'
import {LoginData, RegisterData} from '@/core/utils/validation/auth'
import {httpClient} from '@src/core/utils/axios'
import {RequestBuilder} from '@src/core/utils/axios/request-builder'

/**
 * Logs in a user with the provided credentials.
 * @param credentials - The user's email and password.
 * @returns A promise resolving to the API response containing the login payload.
 */
export async function loginService(
  credentials: LoginData,
): Promise<ApiSuccessResponse<LoginResponse>> {
  const url = new RequestBuilder().setResourcePath('auth/email/login').buildUrl()
  return httpClient.post<LoginResponse, LoginData>({
    url,
    body: credentials,
  })
}

export async function register(credentials: RegisterData): Promise<ApiSuccessResponse<any>> {
  const url = new RequestBuilder().setResourcePath('auth/email/register').buildUrl()
  return httpClient.post<any, RegisterData>({
    url,
    body: credentials,
  })
}

export async function logout(): Promise<void> {
  const url = new RequestBuilder().setResourcePath('auth/logout').buildUrl()
  return httpClient.post<void, void>({url, body: undefined})
}

export async function verifyEmailToken(token: string): Promise<void> {
  const url = new RequestBuilder().setResourcePath('auth/email/confirm').buildUrl()
  return httpClient.post<any, {hash: string}>({
    url,
    body: {hash: token},
  })
}

export function isUserLoggedIn() {
  // Get token from localStorage
  const token = localStorage.getItem('authToken')

  // Check if token exists and is not empty
  if (token && token.trim() !== '') {
    // Optional: Add additional token validation
    try {
      // You might want to add more sophisticated validation
      // like checking token expiration if it's a JWT
      return true
    } catch (error) {
      console.error('Invalid token:', error)
      return false
    }
  }

  return false
}
