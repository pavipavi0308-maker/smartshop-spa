<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import type { Product } from "../types/product"
import { useCart } from "../store/cart"
import { useAuth } from "../store/auth"
import { fetchProductById } from "../services/api"

const route = useRoute()
const router = useRouter()
const product = ref<Product | null>(null)
const { addToCart } = useCart()
const { isAuthenticated } = useAuth()
const selectedImage = ref("")
const addedToCart = ref(false)
const error = ref("")

onMounted(async () => {
  const id = Number(route.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    error.value = "This product could not be found."
    return
  }

  try {
    product.value = await fetchProductById(id)
    selectedImage.value = product.value.thumbnail
  } catch {
    error.value = "We couldn't load this product. Please try again later."
  }
})

function handleAddToCart() {
  if (!product.value) return

  if (!isAuthenticated.value) {
    router.push({
      path: "/login",
      query: {
        redirect: route.fullPath,
        addToCart: String(product.value?.id)
      }
    })
    return
  }

  addToCart(product.value)
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 text-slate-950 dark:bg-none dark:bg-slate-800 dark:text-slate-100">
    <div class="mx-auto max-w-7xl">
      <button
        @click="$router.push('/')"
        class="mb-8 rounded-full border border-cyan-200/60 bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800"
      >
        Back to Products
      </button>

      <div v-if="product" class="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="rounded-[36px] border border-slate-300/60 bg-slate-400/35 p-6 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
          <div class="mb-5 rounded-[28px] border border-white/70 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-950">
            <img
              :src="selectedImage"
              :alt="product.title"
              class="h-[420px] w-full rounded-3xl object-contain"
            />
          </div>

          <div class="flex gap-3 overflow-x-auto pb-1">
            <img
              v-for="img in product.images"
              :key="img"
              :src="img"
              @click="selectedImage = img"
              :class="[
                'h-20 w-20 cursor-pointer rounded-2xl border-2 bg-white object-cover p-1 shadow-sm transition',
                selectedImage === img
                  ? 'border-cyan-400 ring-4 ring-cyan-300/30'
                  : 'border-white/70 hover:border-cyan-300 dark:border-slate-700'
              ]"
            />
          </div>
        </div>

        <div class="rounded-[36px] border border-cyan-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-8 text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950 dark:shadow-slate-950/30">
          <p class="mb-3 text-sm uppercase tracking-[0.3em] text-sky-100/80">
            {{ product.category }}
          </p>

          <h1 class="mb-5 text-4xl font-extrabold tracking-tight">
            {{ product.title }}
          </h1>

          <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold shadow-sm">
            <span>Rating</span>
            <span>{{ product.rating }}/5</span>
          </div>

          <div class="mb-6 rounded-[28px] border border-white/10 bg-white/15 p-5">
            <p class="mb-2 text-sm font-medium text-slate-100">Price</p>
            <p class="text-4xl font-extrabold text-white">
              ${{ product.price.toFixed(2) }}
            </p>
            <p v-if="product.discountPercentage" class="mt-2 text-sm font-semibold text-emerald-100">
              Save {{ product.discountPercentage }}%
            </p>
          </div>

          <div class="mb-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-[24px] border border-white/10 bg-white/15 p-4">
              <p class="mb-2 text-sm font-medium text-slate-100">Availability</p>
              <p v-if="product.stock > 0" class="font-semibold text-white">
                In Stock ({{ product.stock }} available)
              </p>
              <p v-else class="font-semibold text-rose-100">Out of Stock</p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/15 p-4">
              <p class="mb-2 text-sm font-medium text-slate-100">Brand</p>
              <p class="font-semibold text-white">
                {{ product.brand || "SmartShop" }}
              </p>
            </div>
          </div>

          <div class="mb-8 rounded-[28px] bg-white/10 p-5">
            <p class="text-sm leading-7 text-slate-100">
              {{ product.description }}
            </p>
          </div>

          <div class="mb-8 space-y-4">
            <button
              @click="handleAddToCart"
              :disabled="product.stock === 0"
              class="w-full rounded-3xl bg-white px-6 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-slate-100 disabled:bg-slate-400"
            >
              {{ addedToCart ? "Added to Cart!" : "Add to Cart" }}
            </button>

            <router-link
              to="/cart"
              class="block w-full rounded-3xl border border-white/40 px-6 py-4 text-center text-lg font-bold text-white transition hover:bg-white/10"
            >
              View Cart
            </router-link>
          </div>

          <div v-if="!isAuthenticated" class="rounded-3xl bg-white/15 p-4">
            <p class="text-sm text-slate-100">
              You need to
              <router-link to="/login" class="font-bold underline underline-offset-4 hover:no-underline">
                login
              </router-link>
              to add items to your cart
            </p>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="rounded-[36px] border border-rose-200 bg-rose-50 p-8 text-center shadow-xl dark:border-rose-900/50 dark:bg-rose-950/30">
        <p class="text-lg font-semibold text-rose-700 dark:text-rose-200">{{ error }}</p>
        <router-link to="/" class="mt-5 inline-block rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
          Back to Products
        </router-link>
      </div>

      <div v-if="product" class="mt-8 rounded-[36px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="mb-4 text-2xl font-bold text-slate-950 dark:text-white">Description</h2>
        <p class="leading-8 text-slate-700 dark:text-slate-300">
          {{ product.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
