export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken?: string
  refreshToken?: string
}

export interface LoginRequest {
  username: string
  password: string
  expiresInMins?: number
}

export interface AuthResponse extends User {
  accessToken: string
  refreshToken: string
}
