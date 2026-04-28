<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "../store/auth"
import { login } from "../services/api"

const router = useRouter()
const { setAuth } = useAuth()

const username = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

const demoCredentials = [
  { username: "emilys", password: "emilyspass", name: "Emily Johnson" },
  { username: "michaelw", password: "michaelwpass", name: "Michael Williams" },
  { username: "sophiab", password: "sophiabpass", name: "Sophia Brown" }
]

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = "Please enter username and password"
    return
  }

  loading.value = true
  error.value = ""

  try {
    const response = await login({
      username: username.value,
      password: password.value
    })
    setAuth(response)
    router.push("/")
  } catch (e) {
    error.value = "Invalid credentials. Please try again."
    console.error(e)
  } finally {
    loading.value = false
  }
}

function useDemoCredentials(creds: typeof demoCredentials[0]) {
  username.value = creds.username
  password.value = creds.password
}

function handleKeyup(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleLogin()
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold text-center mb-8">Login</h1>

      <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
        {{ error }}
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter username"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup="handleKeyup"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup="handleKeyup"
        />
      </div>

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <div class="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
        <p class="text-sm font-medium text-center mb-4">Demo Credentials:</p>
        <div class="space-y-2">
          <button
            v-for="cred in demoCredentials"
            :key="cred.username"
            @click="useDemoCredentials(cred)"
            class="w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm transition"
          >
            <div class="font-medium">{{ cred.name }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">@{{ cred.username }}</div>
          </button>
        </div>
      </div>

      <p class="text-center mt-6 text-gray-600 dark:text-gray-400">
        Don't have an account?
        <router-link
          to="/register"
          class="text-blue-500 hover:text-blue-600 font-medium"
        >
          Sign up here
        </router-link>
      </p>

      <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
        <router-link
          to="/"
          class="text-blue-500 hover:text-blue-600 font-medium"
        >
          Continue as Guest
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
