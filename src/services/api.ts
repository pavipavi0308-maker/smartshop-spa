
import type { Product } from "../types/product"
import type { AuthResponse, LoginRequest } from "../types/auth"

const API_BASE = "https://dummyjson.com"

// Local user management for registered users
interface LocalUser {
  id: number
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

function getLocalUsers(): LocalUser[] {
  const stored = localStorage.getItem("registered_users")
  if (!stored) return []

  try {
    const users: unknown = JSON.parse(stored)
    return Array.isArray(users) ? users as LocalUser[] : []
  } catch {
    localStorage.removeItem("registered_users")
    return []
  }
}

function saveLocalUser(user: Omit<LocalUser, 'id'>): LocalUser {
  const users = getLocalUsers()
  const newId = Math.max(...users.map(u => u.id), 0) + 1
  const newUser: LocalUser = { ...user, id: newId }
  users.push(newUser)
  localStorage.setItem("registered_users", JSON.stringify(users))
  return newUser
}

function findLocalUser(username: string): LocalUser | undefined {
  const users = getLocalUsers()
  return users.find(u => u.username === username)
}

function userExists(username: string): boolean {
  return !!findLocalUser(username)
}

export async function fetchProducts(skip = 0): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products?limit=20&skip=${skip}`)
  if (!res.ok) throw new Error("Unable to load products.")
  const data = await res.json()
  return Array.isArray(data.products) ? data.products : []
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`)
  if (!res.ok) throw new Error("Unable to load this product.")
  const data = await res.json()
  return data
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  // First check if user exists in local registered users
  const localUser = findLocalUser(credentials.username)
  if (localUser) {
    if (localUser.password !== credentials.password) {
      throw new Error("Login failed. Invalid credentials.")
    }
    // Return mock auth response for locally registered user
    return {
      id: localUser.id,
      username: localUser.username,
      email: localUser.email,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      gender: localUser.gender,
      image: localUser.image,
      accessToken: "local_token_" + Date.now(),
      refreshToken: "local_refresh_" + Date.now()
    }
  }

  // Otherwise try DummyJSON API
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60
    })
  })

  if (!res.ok) {
    throw new Error("Login failed. Invalid credentials.")
  }

  const data = await res.json()
  return data
}

export async function registerUser(userData: {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}): Promise<LocalUser> {
  // Check if username already exists
  if (userExists(userData.username)) {
    throw new Error("Username already exists. Please choose a different username.")
  }

  // Check if email already exists
  const users = getLocalUsers()
  if (users.some(u => u.email === userData.email)) {
    throw new Error("Email already registered. Please use a different email.")
  }

  // Save new user with avatar
  return saveLocalUser({
    username: userData.username,
    password: userData.password,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    gender: "unknown",
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
  })
}

export async function getAuthUser(accessToken: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user")
  }

  return await res.json()
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  })

  if (!res.ok) {
    throw new Error("Failed to refresh token")
  }

  return await res.json()
}

export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/users?limit=100`)
  const data = await res.json()
  return data.users
}
