<script setup lang="ts">
import { useCart } from "../store/cart"
import { useAuth } from "../store/auth"
import { useRouter } from "vue-router"
import { computed, onMounted } from "vue"

const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, reloadCart } = useCart()
const { isAuthenticated } = useAuth()
const router = useRouter()

// Reload cart from localStorage when component mounts
onMounted(() => {
  reloadCart()
})

const total = computed(() => getTotalPrice())

function handleCheckout() {
  if (!isAuthenticated.value) {
    router.push("/login")
    return
  }
  router.push("/checkout")
}

function continueShopping() {
  router.push("/")
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">🛒 Your Cart</h1>

      <div v-if="cart.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
        <div class="text-5xl mb-4">🛒</div>
        <h2 class="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <button
          @click="continueShopping"
          class="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
        >
          Continue Shopping
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="space-y-4">
            <div
              v-for="item in cart"
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex gap-4"
            >
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="w-24 h-24 rounded object-cover"
              />

              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">{{ item.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {{ item.description.substring(0, 100) }}...
                </p>
                <div class="flex justify-between items-center">
                  <span class="text-xl font-bold text-red-500">${{ item.price.toFixed(2) }}</span>
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded">
                      <button
                        @click="decreaseQuantity(item.id)"
                        class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        −
                      </button>
                      <span class="px-3 py-1 font-medium">{{ item.quantity }}</span>
                      <button
                        @click="increaseQuantity(item.id)"
                        class="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      @click="removeFromCart(item.id)"
                      class="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                <p class="text-2xl font-bold">${{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 class="text-2xl font-bold mb-6">Order Summary</h3>

            <div class="space-y-4 mb-6 pb-6 border-b border-gray-300 dark:border-gray-600">
              <div v-for="item in cart" :key="item.id" class="flex justify-between text-sm">
                <span>{{ item.title.substring(0, 25) }}... × {{ item.quantity }}</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="mb-6">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                <span class="text-green-500">Free</span>
              </div>
              <div class="flex justify-between mb-4">
                <span class="text-gray-600 dark:text-gray-400">Tax</span>
                <span>${{ (total * 0.1).toFixed(2) }}</span>
              </div>

              <div class="pt-4 border-t border-gray-300 dark:border-gray-600 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${{ (total + total * 0.1).toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="handleCheckout"
                class="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
              >
                {{ isAuthenticated ? "Proceed to Checkout" : "Login to Checkout" }}
              </button>
              <button
                @click="continueShopping"
                class="w-full px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
              >
                Continue Shopping
              </button>
            </div>

            <p v-if="!isAuthenticated" class="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              <router-link to="/login" class="text-blue-500 hover:text-blue-600 font-medium">
                Sign in
              </router-link>
              to proceed with checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>