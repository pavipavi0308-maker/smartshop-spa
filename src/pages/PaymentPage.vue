<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useCart } from "../store/cart"
import { useAuth } from "../store/auth"
import { useOrders } from "../store/orders"

const router = useRouter()
const route = useRoute()
const { cart, getTotalPrice, clearCart } = useCart()
const { user } = useAuth()
const { addOrder } = useOrders()

const cardNumber = ref("4532 1234 5678 9010")
const cardHolder = ref("John Doe")
const expiryDate = ref("12/25")
const cvv = ref("123")
const error = ref("")
const loading = ref(false)
const paymentSuccess = ref(false)
const orderId = ref("")
const orderTotal = ref(0)

const address = route.query.address as string
const city = route.query.city as string
const postalCode = route.query.postalCode as string
const country = route.query.country as string
const paymentMethod = route.query.paymentMethod as "card" | "cash"

onMounted(() => {
  if (!address) {
    router.push("/cart")
  }
})

function formatCardNumber(value: string): string {
  return value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim()
}

function formatExpiryDate(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  if (cleanValue.length >= 2) {
    return cleanValue.slice(0, 2) + "/" + cleanValue.slice(2, 4)
  }
  return cleanValue
}

function onCardNumberInput(e: Event) {
  const target = e.target as HTMLInputElement
  target.value = formatCardNumber(target.value)
}

function onExpiryDateInput(e: Event) {
  const target = e.target as HTMLInputElement
  target.value = formatExpiryDate(target.value)
}

function validateCardDetails(): boolean {
  // Check if cart is empty
  if (cart.value.length === 0) {
    error.value = "Your cart is empty. Please add items before checking out."
    return false
  }

  if (paymentMethod === "card") {
    if (!cardNumber.value || !cardHolder.value || !expiryDate.value || !cvv.value) {
      error.value = "Please fill in all card details"
      return false
    }

    const cleanCardNumber = cardNumber.value.replace(/\s/g, "")
    if (cleanCardNumber.length !== 16) {
      error.value = "Card number must be 16 digits"
      return false
    }

    if (cvv.value.length !== 3) {
      error.value = "CVV must be 3 digits"
      return false
    }

    // Validate expiry date format MM/YY
    if (!expiryDate.value.match(/^\d{2}\/\d{2}$/)) {
      error.value = "Expiry date must be in MM/YY format"
      return false
    }

    const parts = expiryDate.value.split("/").map(Number)
    const month = parts[0]
    if (!month || month < 1 || month > 12) {
      error.value = "Invalid month in expiry date"
      return false
    }
  }

  return true
}

async function processPayment() {
  if (!validateCardDetails()) {
    return
  }

  loading.value = true
  error.value = ""

  // Simulate payment processing
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Save total before clearing cart
    orderTotal.value = getTotalPrice()

    const newOrderId = "ORD-" + Date.now()
    const order = {
      id: newOrderId,
      userId: user.value?.id || 0,
      items: cart.value,
      totalPrice: orderTotal.value,
      totalQuantity: cart.value.reduce((sum, item) => sum + item.quantity, 0),
      paymentMethod: paymentMethod,
      status: "completed" as const,
      createdAt: new Date().toISOString(),
      shippingAddress: {
        address,
        city,
        postalCode,
        country
      }
    }

    addOrder(order)
    orderId.value = newOrderId
    
    // Clear cart BEFORE showing success to ensure it's empty
    console.log("Cart before clear:", cart.value.length)
    clearCart()
    console.log("Cart after clear:", cart.value.length)
    console.log("LocalStorage cart:", localStorage.getItem("cart"))
    
    paymentSuccess.value = true
  } catch (e) {
    error.value = "Payment processing failed. Please try again."
    console.error(e)
  } finally {
    loading.value = false
  }
}

function continueShopping() {
  router.push("/")
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Success State -->
      <div v-if="paymentSuccess" class="text-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div class="text-6xl mb-4">✅</div>
          <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your order
          </p>

          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8 text-left">
            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
              <p class="text-lg font-bold">{{ orderId }}</p>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
              <p class="text-lg font-bold">{{ new Date().toLocaleDateString() }}</p>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Shipping Address</p>
              <p class="text-lg font-bold">
                {{ address }}<br>
                {{ city }}, {{ postalCode }}<br>
                {{ country }}
              </p>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
              <p class="text-lg font-bold">
                {{ paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery" }}
              </p>
            </div>

            <div class="pt-4 border-t border-gray-300 dark:border-gray-600">
              <p class="text-sm text-gray-600 dark:text-gray-400">Order Total</p>
              <p class="text-2xl font-bold">${{ orderTotal.toFixed(2) }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <button
              @click="continueShopping"
              class="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Form -->
      <div v-else>
        <h1 class="text-3xl font-bold mb-8">Payment</h1>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div v-if="error" class="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {{ error }}
          </div>

          <!-- Card Payment Form -->
          <div v-if="paymentMethod === 'card'">
            <h2 class="text-xl font-bold mb-6">Card Details</h2>

            <!-- Card Preview -->
            <div class="mb-8 perspective">
              <div class="bg-linear-to-br from-blue-600 to-blue-900 rounded-lg shadow-xl p-8 text-white min-h-52 relative overflow-hidden">
                <!-- Decorative circles -->
                <div class="absolute top-4 right-4 w-12 h-12 border-2 border-blue-300 rounded-full opacity-50"></div>
                <div class="absolute bottom-4 right-8 w-20 h-20 border-2 border-blue-400 rounded-full opacity-30"></div>

                <!-- Card content -->
                <div class="relative z-10">
                  <div class="mb-8">
                    <p class="text-sm text-blue-200 mb-1">Card Number</p>
                    <p class="text-2xl font-mono tracking-widest">
                      {{ cardNumber || '•••• •••• •••• ••••' }}
                    </p>
                  </div>

                  <div class="flex justify-between items-end">
                    <div>
                      <p class="text-xs text-blue-200 mb-1">Card Holder</p>
                      <p class="text-lg font-semibold uppercase">
                        {{ cardHolder || 'YOUR NAME' }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-blue-200 mb-1">Expires</p>
                      <p class="text-lg font-mono">
                        {{ expiryDate || 'MM/YY' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Dummy card for testing - will not be charged</p>
            </div>

            <!-- Card Form -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Card Number</label>
                <input
                  v-model="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="onCardNumberInput"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Card Holder Name</label>
                <input
                  v-model="cardHolder"
                  type="text"
                  placeholder="John Doe"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    v-model="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                    @input="onExpiryDateInput"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">CVV</label>
                  <input
                    v-model="cvv"
                    type="text"
                    placeholder="123"
                    maxlength="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

            </div>
          </div>

          <!-- Cash on Delivery -->
          <div v-else>
            <div class="p-6 bg-blue-50 dark:bg-blue-900 rounded-lg mb-6">
              <h2 class="text-lg font-bold mb-2">Cash on Delivery</h2>
              <p class="text-gray-700 dark:text-gray-300">
                You will pay <strong>${{ getTotalPrice().toFixed(2) }}</strong> when the order is delivered.
              </p>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-bold mb-4">Order Summary</h3>
            <div class="space-y-2 mb-4">
              <div v-for="item in cart" :key="item.id" class="flex justify-between text-sm">
                <span>{{ item.title }} (x{{ item.quantity }})</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="pt-4 border-t border-gray-300 dark:border-gray-600 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${{ getTotalPrice().toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex gap-4">
            <router-link
              to="/checkout"
              class="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center font-medium"
            >
              Back
            </router-link>
            <button
              @click="processPayment"
              :disabled="loading"
              class="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {{ loading ? "Processing..." : `Pay $${getTotalPrice().toFixed(2)}` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
