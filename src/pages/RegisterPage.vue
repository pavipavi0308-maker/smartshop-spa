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
    await registerUser({
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      password: password.value
    })

    const loginData = await login({
      username: username.value,
      password: password.value
    })

    setAuth(loginData)
    successMessage.value = "Registration successful! Redirecting..."

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
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 dark:bg-none dark:bg-slate-800">
    <div class="grid w-full max-w-5xl overflow-hidden rounded-[40px] border border-slate-300/60 bg-slate-400/35 shadow-2xl shadow-slate-900/10 lg:grid-cols-[0.9fr_1.1fr] dark:border-slate-800 dark:bg-slate-900">
      <div class="hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-slate-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p class="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-100/80">SmartShop</p>
          <h2 class="text-4xl font-extrabold leading-tight">Create your shopping account.</h2>
          <p class="mt-5 text-slate-100">Save your cart, manage orders, and checkout faster every time.</p>
        </div>
        <div class="rounded-[28px] bg-white/15 p-5">
          <p class="font-semibold">Fast signup</p>
          <p class="mt-2 text-sm text-slate-100">Fill the form once and continue browsing with your account ready.</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 p-8 dark:bg-none dark:bg-slate-950/90">
        <h1 class="mb-2 text-center text-3xl font-extrabold text-slate-950 dark:text-white">Create Account</h1>
        <p class="mb-8 text-center text-slate-600 dark:text-slate-400">Join SmartShop today</p>

        <div v-if="error" class="mb-4 rounded-2xl bg-rose-100 p-4 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
          {{ error }}
        </div>

        <div v-if="successMessage" class="mb-4 rounded-2xl bg-emerald-100 p-4 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
          {{ successMessage }}
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">First Name</label>
            <input
              v-model="firstName"
              type="text"
              placeholder="John"
              class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              @keyup="handleKeyup"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Last Name</label>
            <input
              v-model="lastName"
              type="text"
              placeholder="Doe"
              class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              @keyup="handleKeyup"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="johndoe"
            class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            @keyup="handleKeyup"
          />
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="john@example.com"
            class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            @keyup="handleKeyup"
          />
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter password (min 6 characters)"
            class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            @keyup="handleKeyup"
          />
        </div>

        <div class="mb-6">
          <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            @keyup="handleKeyup"
          />
        </div>

        <button
          @click="handleRegister"
          :disabled="loading"
          class="mb-4 w-full rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-500"
        >
          {{ loading ? "Creating Account..." : "Sign Up" }}
        </button>

        <div class="text-center">
          <p class="text-slate-600 dark:text-slate-400">
            Already have an account?
            <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-300">
              Login here
            </router-link>
          </p>
        </div>

        <div class="mt-6 border-t border-slate-300/70 pt-6 dark:border-slate-800">
          <p class="text-center text-xs text-slate-500 dark:text-slate-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
