<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuth } from "../store/auth"
import { useCart } from "../store/cart"
import { login } from "../services/api"
import type { Product } from "../types/product"

const route = useRoute()
const router = useRouter()
const { setAuth } = useAuth()
const { addToCart } = useCart()

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

    const addToCartId = Number(route.query.addToCart)
    if (Number.isFinite(addToCartId) && addToCartId > 0) {
      const productResponse = await fetch(`https://dummyjson.com/products/${addToCartId}`)
      const product = await productResponse.json() as Product
      addToCart(product)
      router.push("/cart")
      return
    }

    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/"
    router.push(redirect)
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
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 dark:bg-none dark:bg-slate-800">
    <div class="grid w-full max-w-5xl overflow-hidden rounded-[40px] border border-slate-300/60 bg-slate-400/35 shadow-2xl shadow-slate-900/10 lg:grid-cols-[0.9fr_1.1fr] dark:border-slate-800 dark:bg-slate-900">
      <div class="hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-slate-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100/80">SmartShop</p>
          <h2 class="text-4xl font-extrabold leading-tight">Shop smarter after one quick sign in.</h2>
          <p class="mt-5 text-slate-100">Keep your cart, checkout faster, and continue where you left off.</p>
        </div>
        <div class="rounded-[28px] bg-white/15 p-5">
          <p class="font-semibold">Demo users are ready below</p>
          <p class="mt-2 text-sm text-slate-100">Pick a saved account and jump straight back to shopping.</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 p-8 dark:bg-none dark:bg-slate-950/90">
        <h1 class="mb-8 text-center text-3xl font-extrabold text-slate-950 dark:text-white">Login</h1>

        <div v-if="error" class="mb-4 rounded-2xl bg-rose-100 p-4 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
          {{ error }}
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
            class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            @keyup="handleKeyup"
          />
        </div>

        <div class="mb-6">
          <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
            class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            @keyup="handleKeyup"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-500"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

        <div class="mt-6 border-t border-slate-300/70 pt-6 dark:border-slate-800">
          <p class="mb-4 text-center text-sm font-semibold text-slate-800 dark:text-slate-200">Demo Credentials</p>
          <div class="space-y-2">
            <button
              v-for="cred in demoCredentials"
              :key="cred.username"
              @click="useDemoCredentials(cred)"
              class="w-full rounded-2xl bg-white/80 px-4 py-3 text-left text-sm shadow-sm ring-1 ring-sky-200 transition hover:bg-white dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800"
            >
              <div class="font-semibold text-slate-950 dark:text-white">{{ cred.name }}</div>
              <div class="text-xs text-slate-600 dark:text-slate-400">@{{ cred.username }}</div>
            </button>
          </div>
        </div>

        <p class="mt-6 text-center text-slate-600 dark:text-slate-400">
          Don't have an account?
          <router-link to="/register" class="font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-300">
            Sign up here
          </router-link>
        </p>

        <p class="mt-4 text-center text-slate-600 dark:text-slate-400">
          <router-link to="/" class="font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-300">
            Continue as Guest
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
