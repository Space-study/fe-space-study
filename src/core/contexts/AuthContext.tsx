import axios from 'axios'
import router from 'next/router'
import {createContext, useContext, useEffect, useState} from 'react'
import {apiPath} from '../utils/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  refetchUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No token found')

      const res = await axios.get(apiPath('api/v1/auth/me'), {
        headers: {Authorization: `Bearer ${token}`},
      })

      setUser(res.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)

      // Clear localStorage if 401 unauthorized
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push('/auth/login')
        localStorage.clear()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{user, loading, refetchUser: fetchUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
