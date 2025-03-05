export type LoginResponse = {
  refreshToken: string
  token: string
  tokenExpires: number
  user: {
    id: number
    email: string
    provider: string
    socialId: string | null
    firstName: string
    lastName: string
    role: {
      id: number
      name: string
      __entity: string
    }
    status: {
      id: number
      name: string
      __entity: string
    }
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
}
