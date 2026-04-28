<script setup lang="ts">
import { useCart } from "../store/cart"
import { useRouter } from "vue-router"
import { useAuth } from "../store/auth"
import { ref } from "vue"

const { cart } = useCart()
const { isAuthenticated, user, logout } = useAuth()
const router = useRouter()
const showProfileMenu = ref(false)

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark")
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
  <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 20px; background:#222; color:white;">
    
    <h2 @click="router.push('/')" style="cursor:pointer; margin:0;">
      SmartShop
    </h2>

    <div style="display:flex; align-items:center; gap:15px;">
      <!-- Cart -->
      <div
        @click="router.push('/cart')"
        style="cursor:pointer; display:flex; align-items:center; gap:5px;"
      >
        <span style="font-size:18px;">🛒</span>
        <span>Cart ({{ cart.length }})</span>
      </div>

      <!-- Dark Mode -->
      <button
        @click="toggleDarkMode"
        style="padding:5px 10px; cursor:pointer; background:none; border:none; color:white; font-size:16px;"
      >
        🌙
      </button>

      <!-- Auth -->
      <div style="position:relative;">
        <div v-if="isAuthenticated" style="display:flex; align-items:center; gap:10px;">
          <!-- Profile Icon -->
          <div
            @click="showProfileMenu = !showProfileMenu"
            style="cursor:pointer; display:flex; align-items:center; gap:5px; padding:5px 10px; border-radius:50%; background:#444; hover:bg:#555;"
          >
            <img
              :src="user?.image"
              :alt="user?.firstName"
              style="width:32px; height:32px; border-radius:50%; object-fit:cover;"
            />
          </div>

          <!-- Profile Dropdown Menu -->
          <div
            v-if="showProfileMenu"
            style="position:absolute; top:50px; right:0; background:#333; border:1px solid #555; border-radius:8px; min-width:200px; box-shadow:0 4px 6px rgba(0,0,0,0.3); z-index:1000;"
          >
            <div style="padding:15px; border-bottom:1px solid #555;">
              <p style="margin:0; font-weight:bold;">{{ user?.firstName }} {{ user?.lastName }}</p>
              <p style="margin:5px 0 0 0; font-size:12px; color:#999;">@{{ user?.username }}</p>
            </div>

            <button
              @click="navigateTo('/my-profile')"
              style="display:block; width:100%; text-align:left; padding:12px 15px; background:none; border:none; color:white; cursor:pointer; hover:bg:#444;"
            >
              👤 My Profile
            </button>

            <button
              @click="handleLogout"
              style="display:block; width:100%; text-align:left; padding:12px 15px; background:none; border:none; color:#ff6b6b; cursor:pointer; hover:bg:#444; border-top:1px solid #555; font-weight:bold;"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <!-- Login/Register Buttons -->
        <div v-else style="display:flex; gap:10px;">
          <router-link
            to="/login"
            style="padding:8px 16px; background:#0066cc; color:white; text-decoration:none; border-radius:4px; cursor:pointer; font-weight:bold; hover:bg:#0052a3; transition:background 0.2s;"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            style="padding:8px 16px; background:#28a745; color:white; text-decoration:none; border-radius:4px; cursor:pointer; font-weight:bold; hover:bg:#218838; transition:background 0.2s;"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Click outside to close menu -->
  <div
    v-if="showProfileMenu"
    @click="showProfileMenu = false"
    style="position:fixed; top:0; left:0; right:0; bottom:0; z-index:999;"
  ></div>
</template>

<style scoped>
</style>