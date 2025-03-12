import {useUser} from '@src/app/shared/UserProvider'
import axios from 'axios'

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API, // Replace with your API base URL
  timeout: 10000, // Increased timeout to 10000ms
  headers: {'Content-Type': 'application/json'},
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = getCookie('refreshToken')
      if (refreshToken) {
        try {
          // Call API to refresh token
          const refreshResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_URL_API}/api/v1/auth/refresh`,
            {refreshToken},
          )

          const {token, refreshToken: newRefreshToken, tokenExpires} = refreshResponse.data

          localStorage.setItem('authToken', token)
          document.cookie = `refreshToken=${newRefreshToken}; path=/;`

          const {login, user} = useUser()
          if (user) {
            login({
              token,
              refreshToken: newRefreshToken,
              tokenExpires,
              user: user,
            })
          }

          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          console.error('Unable to refresh token:', refreshError)
          localStorage.removeItem('authToken')
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          window.location.href = '/auth/login'
          return Promise.reject(refreshError)
        }
      } else {
        console.error('Refresh token not found, redirecting to login page...')
        window.location.href = '/auth/login'
      }
    }

    // If not a 401 error or unable to refresh, reject error
    return Promise.reject(error)
  },
)

export default axiosInstance
