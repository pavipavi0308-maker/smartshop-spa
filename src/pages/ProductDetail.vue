<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import type { Product } from "../types/product"
import { useCart } from "../store/cart"
import { useAuth } from "../store/auth"

const route = useRoute()
const router = useRouter()
const product = ref<Product | null>(null)
const { addToCart } = useCart()
const { isAuthenticated } = useAuth()
const selectedImage = ref("")
const addedToCart = ref(false)

onMounted(async () => {
  const res = await fetch(`https://dummyjson.com/products/${route.params.id}`)
  const data = await res.json()
  product.value = data
  selectedImage.value = data.thumbnail
})

function handleAddToCart() {
  if (!isAuthenticated.value) {
    router.push("/login")
    return
  }
  addToCart(product.value!)
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <button
        @click="$router.push('/')"
        class="mb-8 px-4 py-2 text-blue-500 hover:text-blue-600 font-medium transition"
      >
        ← Back to Products
      </button>

      <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Images Section -->
        <div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <img
              :src="selectedImage"
              :alt="product.title"
              class="w-full h-96 object-contain rounded"
            />
          </div>

          <div class="flex gap-3 overflow-x-auto">
            <img
              v-for="img in product.images"
              :key="img"
              :src="img"
              @click="selectedImage = img"
              :class="[
                'w-20 h-20 object-cover rounded cursor-pointer border-2 transition',
                selectedImage === img
                  ? 'border-blue-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              ]"
            />
          </div>
        </div>

        <!-- Product Info Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {{ product.category }}
          </p>

          <h1 class="text-4xl font-bold mb-4">{{ product.title }}</h1>

          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">⭐</span>
            <span class="text-lg font-medium">{{ product.rating }}/5</span>
          </div>

          <div class="mb-6 pb-6 border-b border-gray-300 dark:border-gray-600">
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">Price</p>
            <p class="text-4xl font-bold text-red-500">${{ product.price.toFixed(2) }}</p>
            <p v-if="product.discountPercentage" class="text-sm text-green-600 mt-2">
              Save {{ product.discountPercentage }}%
            </p>
          </div>

          <div class="mb-6">
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">Availability</p>
            <p v-if="product.stock > 0" class="text-green-600 font-medium">
              ✓ In Stock ({{ product.stock }} items available)
            </p>
            <p v-else class="text-red-600 font-medium">Out of Stock</p>
          </div>

          <div class="mb-8">
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">Brand</p>
            <p class="text-lg font-medium">{{ product.brand }}</p>
          </div>

          <div class="space-y-4 mb-8">
            <button
              @click="handleAddToCart"
              :disabled="product.stock === 0"
              class="w-full px-6 py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-bold text-lg transition"
            >
              {{ addedToCart ? "✓ Added to Cart!" : "Add to Cart" }}
            </button>

            <router-link
              to="/cart"
              class="block w-full px-6 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg font-bold text-center transition"
            >
              View Cart
            </router-link>
          </div>

          <div v-if="!isAuthenticated" class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-200">
              You need to
              <router-link to="/login" class="font-bold underline hover:no-underline">
                login
              </router-link>
              to add items to your cart
            </p>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div v-if="product" class="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold mb-4">Description</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ product.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>