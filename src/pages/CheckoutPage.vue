<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useCart } from "../store/cart"

const router = useRouter()
const { cart, getTotalPrice, reloadCart } = useCart()

// Reload cart from localStorage when component mounts to ensure fresh state
onMounted(() => {
  reloadCart()
})

const step = ref<1 | 2>(1)
const address = ref("")
const city = ref("")
const postalCode = ref("")
const country = ref("")
const paymentMethod = ref<"card" | "cash">("card")
const error = ref("")

function handleNextStep() {
  if (!address.value || !city.value || !postalCode.value || !country.value) {
    error.value = "⚠️ Please fill in all address fields to continue"
    return
  }
  error.value = ""
  step.value = 2
}

function handlePrevStep() {
  step.value = 1
}

function handlePayment() {
  router.push({
    name: "payment",
    query: {
      address: address.value,
      city: city.value,
      postalCode: postalCode.value,
      country: country.value,
      paymentMethod: paymentMethod.value
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      <div class="grid grid-cols-2 gap-4 mb-8">
        <div :class="['p-4 rounded-lg text-center font-medium', step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600']">
          1. Shipping
        </div>
        <div :class="['p-4 rounded-lg text-center font-medium', step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600']">
          2. Payment
        </div>
      </div>

      <!-- Step 1: Shipping Address -->
      <div v-if="step === 1" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold mb-6">Shipping Address</h2>

            <div v-if="error" class="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
              {{ error }}
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Street Address</label>
              <input
                v-model="address"
                type="text"
                placeholder="Enter street address"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium mb-2">City</label>
                <input
                  v-model="city"
                  type="text"
                  placeholder="City"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  v-model="postalCode"
                  type="text"
                  placeholder="Postal Code"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Country</label>
              <input
                v-model="country"
                type="text"
                placeholder="Country"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex justify-between gap-4">
              <router-link
                to="/cart"
                class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Back to Cart
              </router-link>
              <button
                @click="handleNextStep"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 class="text-xl font-bold mb-4">Order Summary</h3>
            <div class="divide-y divide-gray-300 dark:divide-gray-600">
              <div v-for="item in cart" :key="item.id" class="py-3">
                <div class="flex justify-between text-sm">
                  <span>{{ item.title }}</span>
                  <span>x{{ item.quantity }}</span>
                </div>
                <div class="flex justify-between font-medium mt-1">
                  <span>${{ item.price.toFixed(2) }}</span>
                  <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${{ getTotalPrice().toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Payment Method -->
      <div v-if="step === 2" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold mb-6">Select Payment Method</h2>

            <div class="space-y-4">
              <label :class="['flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition', paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600']">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="card"
                  class="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <div class="ml-4">
                  <div class="font-medium">💳 Credit/Debit Card</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Pay securely with your card</p>
                </div>
              </label>

              <label :class="['flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition', paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600']">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="cash"
                  class="w-4 h-4 text-blue-500 cursor-pointer"
                />
                <div class="ml-4">
                  <div class="font-medium">💵 Cash on Delivery</div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</p>
                </div>
              </label>
            </div>

            <div class="mt-8 flex justify-between gap-4">
              <button
                @click="handlePrevStep"
                class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Back
              </button>
              <button
                @click="handlePayment"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 class="text-xl font-bold mb-4">Order Summary</h3>
            <div class="divide-y divide-gray-300 dark:divide-gray-600">
              <div v-for="item in cart" :key="item.id" class="py-3">
                <div class="flex justify-between text-sm">
                  <span>{{ item.title }}</span>
                  <span>x{{ item.quantity }}</span>
                </div>
                <div class="flex justify-between font-medium mt-1">
                  <span>${{ item.price.toFixed(2) }}</span>
                  <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <div class="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${{ getTotalPrice().toFixed(2) }}</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Shipping to:<br>
                {{ address }}<br>
                {{ city }}, {{ postalCode }}<br>
                {{ country }}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
