<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "../store/auth"
import { registerUser, login } from "../services/api"

const router = useRouter()
const { setAuth } = useAuth()

const firstName = ref("")
const lastName = ref("")
const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const error = ref("")
const loading = ref(false)
const successMessage = ref("")

async function handleRegister() {
  error.value = ""
  successMessage.value = ""

  // Validate form
  if (!firstName.value || !lastName.value || !username.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = "Please fill in all fields"
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match"
    return
  }

  if (password.value.length < 6) {
    error.value = "Password must be at least 6 characters"
    return
  }

  if (!email.value.includes("@")) {
    error.value = "Please enter a valid email address"
    return
  }

  loading.value = true

  try {
    // Register user locally
    await registerUser({
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      password: password.value
    })

    // Automatically login after registration
    const loginData = await login({
      username: username.value,
      password: password.value
    })

    setAuth(loginData)
    
    successMessage.value = "✅ Registration successful! Redirecting..."
    setTimeout(() => {
      router.push("/")
    }, 1500)
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Registration failed. Please try again."
    console.error(e)
  } finally {
    loading.value = false
  }
}

function handleKeyup(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleRegister()
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 py-8 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-center mb-2">Create Account</h1>
      <p class="text-center text-gray-600 dark:text-gray-400 mb-8">Join SmartShop today</p>

      <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
        {{ error }}
      </div>

      <div v-if="successMessage" class="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
        {{ successMessage }}
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">First Name</label>
          <input
            v-model="firstName"
            type="text"
            placeholder="John"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup="handleKeyup"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Last Name</label>
          <input
            v-model="lastName"
            type="text"
            placeholder="Doe"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup="handleKeyup"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="johndoe"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup="handleKeyup"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="john@example.com"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup="handleKeyup"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password (min 6 characters)"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup="handleKeyup"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Confirm Password</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup="handleKeyup"
        />
      </div>

      <button
        @click="handleRegister"
        :disabled="loading"
        class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mb-4"
      >
        {{ loading ? "Creating Account..." : "Sign Up" }}
      </button>

      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Already have an account?
          <router-link
            to="/login"
            class="text-blue-500 hover:text-blue-600 font-medium"
          >
            Login here
          </router-link>
        </p>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
