import { ref, computed } from "vue"
import type { User, AuthResponse } from "../types/auth"

const currentUser = ref<User | null>(null)
const accessToken = ref<string | null>(localStorage.getItem("accessToken"))
const refreshToken = ref<string | null>(localStorage.getItem("refreshToken"))

export function useAuth() {
  const isAuthenticated = computed(() => !!accessToken.value && !!currentUser.value)
  const user = computed(() => currentUser.value)

  function setAuth(response: AuthResponse) {
    currentUser.value = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image
    }
    accessToken.value = response.accessToken
    refreshToken.value = response.refreshToken

    // Save to localStorage
    localStorage.setItem("accessToken", response.accessToken)
    localStorage.setItem("refreshToken", response.refreshToken)
    localStorage.setItem("user", JSON.stringify(currentUser.value))
  }

  function logout() {
    currentUser.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
  }

  function initializeAuth() {
    const savedToken = localStorage.getItem("accessToken")
    const savedUser = localStorage.getItem("user")
    
    if (savedToken && savedUser) {
      try {
        const user: User = JSON.parse(savedUser)
        
        // Validate local users against registered_users in localStorage
        if (savedToken.startsWith("local_token_")) {
          const registeredUsers = localStorage.getItem("registered_users")
          if (!registeredUsers) {
            logout()
            return
          }

          const users: unknown = JSON.parse(registeredUsers)
          const userExists = Array.isArray(users) && users.some(
            (registeredUser: { username?: unknown }) => registeredUser.username === user.username
          )

          if (!userExists) {
            logout()
            return
          }
        }
        
        // Restore auth state
        accessToken.value = savedToken
        refreshToken.value = localStorage.getItem("refreshToken")
        currentUser.value = user
      } catch (e) {
        logout()
      }
    }
  }

  return {
    currentUser,
    accessToken,
    refreshToken,
    isAuthenticated,
    user,
    setAuth,
    logout,
    initializeAuth
  }
}
