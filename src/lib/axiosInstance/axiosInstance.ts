import axios from 'axios'

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
    // Do something with the response data
    console.log('Response:', response)
    return response
  },
  function (error) {
    // Handle the response error
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      console.error('Unauthorized, logging out...')
      // Perform any logout actions or redirect to login page
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
