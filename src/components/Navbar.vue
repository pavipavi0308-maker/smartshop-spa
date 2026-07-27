<script setup lang="ts">
import { useCart } from "../store/cart"
import { useRouter } from "vue-router"
import { useAuth } from "../store/auth"
import { ref, onMounted } from "vue"

const { cart } = useCart()
const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()
const showProfileMenu = ref(false)
const isDarkMode = ref(false)

onMounted(() => {
  const savedMode = localStorage.getItem("smartshop-dark-mode")
  if (savedMode === "true" || (!savedMode && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add("dark")
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove("dark")
  }
})

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle("dark", isDarkMode.value)
  localStorage.setItem("smartshop-dark-mode", String(isDarkMode.value))
}

function handleLogout() {
  logout()
  router.push("/")
  showProfileMenu.value = false
}

function navigateTo(path: string) {
  router.push(path)
  showProfileMenu.value = false
}
</script>

<template>
  <header class="relative sticky top-4 z-40 mx-4 mt-4 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-500 to-slate-900 border border-white/10 shadow-lg shadow-slate-900/20 dark:bg-slate-950/95 dark:border-slate-800">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
      <div class="flex items-center gap-3 cursor-pointer z-50" @click="navigateTo('/')">
        <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
          <span class="text-lg">S</span>
        </div>
        <div>
          <p class="text-lg font-semibold text-white drop-shadow-sm dark:text-white">SmartShop</p>
          <p class="text-xs font-medium text-white/85 drop-shadow-sm dark:text-slate-300">Shop smarter, faster</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="toggleDarkMode"
          class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span>🌙</span>
          <span class="hidden sm:inline">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>

        <button
          @click="navigateTo('/cart')"
          class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span class="text-lg">🛒</span>
          <span>Cart</span>
          <span class="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">{{ cart.length }}</span>
        </button>

        <div class="relative">
          <div v-if="isAuthenticated" class="flex items-center gap-3">
            <button
              @click="showProfileMenu = !showProfileMenu"
              class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <img
                :src="user?.image"
                :alt="user?.firstName"
                class="h-8 w-8 rounded-full object-cover"
              />
              <span class="hidden sm:inline">Profile</span>
            </button>
          </div>

          <div v-else class="flex items-center gap-2">
            <router-link
              to="/login"
              class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="rounded-2xl bg-slate-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              Sign Up
            </router-link>
          </div>

          <div
            v-if="showProfileMenu"
            class="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ user?.firstName }} {{ user?.lastName }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">@{{ user?.username }}</p>
            </div>
            <button
              @click="navigateTo('/my-profile')"
              class="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              👤 My Profile
            </button>
            <button
              @click="handleLogout"
              class="w-full px-4 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div
    v-if="showProfileMenu"
    @click="showProfileMenu = false"
    class="fixed inset-0 z-30"
  ></div>
</template>

<style scoped>
</style>
