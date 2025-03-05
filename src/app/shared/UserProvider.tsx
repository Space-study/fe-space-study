import React, {createContext, ReactNode, useContext, useState} from 'react'

interface UserRole {
  id: number
  name: string
  __entity: string
}

interface UserStatus {
  id: number
  name: string
  __entity: string
}

interface User {
  id: number
  email: string
  provider: string
  socialId: string | null
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  deletedAt: string | null
}

interface AuthTokens {
  token: string
  refreshToken: string
  tokenExpires: number
}

interface UserContextType {
  user: User | null
  tokens: AuthTokens | null
  login: (loginResponse: {
    user: User
    token: string
    refreshToken: string
    tokenExpires: number
  }) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)

  // Secure login method
  const login = (loginResponse: {
    user: User
    token: string
    refreshToken: string
    tokenExpires: number
  }) => {
    // Only store in memory, not in persistent storage
    setUser(loginResponse.user)
    setTokens({
      token: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
      tokenExpires: loginResponse.tokenExpires,
    })
  }

  const logout = () => {
    setUser(null)
    setTokens(null)
  }

  const isAuthenticated = () => {
    if (!tokens) return false
    return Date.now() < tokens.tokenExpires
  }

  return (
    <UserContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        isAuthenticated,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
