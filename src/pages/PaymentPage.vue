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

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    orderTotal.value = getTotalPrice()

    const newOrderId = "ORD-" + Date.now()
    const order = {
      id: newOrderId,
      userId: user.value?.id || 0,
      items: cart.value,
      totalPrice: orderTotal.value,
      totalQuantity: cart.value.reduce((sum, item) => sum + item.quantity, 0),
      paymentMethod,
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
    clearCart()
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
  <div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 text-slate-950 dark:bg-none dark:bg-slate-800 dark:text-slate-100">
    <div class="mx-auto max-w-5xl">
      <div v-if="paymentSuccess" class="rounded-[40px] border border-cyan-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-10 text-center text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-extrabold">
          OK
        </div>
        <h1 class="mb-3 text-4xl font-extrabold">Payment Successful</h1>
        <p class="mb-8 text-slate-100">Thank you for your order.</p>

        <div class="mx-auto mb-8 max-w-2xl rounded-[28px] bg-white/15 p-6 text-left">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-sm text-slate-200">Order ID</p>
              <p class="font-bold text-white">{{ orderId }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-200">Order Date</p>
              <p class="font-bold text-white">{{ new Date().toLocaleDateString() }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-200">Payment Method</p>
              <p class="font-bold text-white">
                {{ paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery" }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-200">Order Total</p>
              <p class="font-bold text-white">${{ orderTotal.toFixed(2) }}</p>
            </div>
          </div>
          <div class="mt-5 border-t border-white/20 pt-5">
            <p class="text-sm text-slate-200">Shipping Address</p>
            <p class="font-bold text-white">
              {{ address }}, {{ city }}, {{ postalCode }}, {{ country }}
            </p>
          </div>
        </div>

        <button
          @click="continueShopping"
          class="rounded-3xl bg-white px-8 py-4 font-bold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
        >
          Continue Shopping
        </button>
      </div>

      <div v-else>
        <div class="mb-8 rounded-[36px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
          <p class="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-700 dark:text-slate-400">
            Final step
          </p>
          <h1 class="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Payment
          </h1>
        </div>

        <div class="rounded-[40px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
          <div v-if="error" class="mb-6 rounded-2xl bg-rose-100 p-4 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
            {{ error }}
          </div>

          <div v-if="paymentMethod === 'card'">
            <h2 class="mb-6 text-2xl font-extrabold text-slate-950 dark:text-white">Card Details</h2>

            <div class="mb-8 rounded-[32px] bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-8 text-white shadow-2xl shadow-sky-500/20">
              <div class="mb-10 flex items-start justify-between">
                <div>
                  <p class="mb-2 text-sm text-sky-100">Card Number</p>
                  <p class="font-mono text-2xl tracking-[0.18em]">
                    {{ cardNumber || "0000 0000 0000 0000" }}
                  </p>
                </div>
                <div class="h-14 w-14 rounded-full border-2 border-white/30"></div>
              </div>

              <div class="flex justify-between gap-6">
                <div>
                  <p class="mb-2 text-xs text-sky-100">Card Holder</p>
                  <p class="text-lg font-bold uppercase">{{ cardHolder || "YOUR NAME" }}</p>
                </div>
                <div class="text-right">
                  <p class="mb-2 text-xs text-sky-100">Expires</p>
                  <p class="font-mono text-lg">{{ expiryDate || "MM/YY" }}</p>
                </div>
              </div>
            </div>

            <p class="mb-8 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
              Dummy card for testing - will not be charged
            </p>

            <div class="mb-6 rounded-[32px] bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 p-6 dark:bg-none dark:bg-slate-950">
              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Card Number</label>
                <input
                  v-model="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="onCardNumberInput"
                  class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div class="mb-4">
                <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Card Holder Name</label>
                <input
                  v-model="cardHolder"
                  type="text"
                  placeholder="John Doe"
                  class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Expiry Date</label>
                  <input
                    v-model="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    maxlength="5"
                    @input="onExpiryDateInput"
                    class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">CVV</label>
                  <input
                    v-model="cvv"
                    type="text"
                    placeholder="123"
                    maxlength="3"
                    class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="mb-6 rounded-[32px] bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-8 text-white shadow-2xl shadow-sky-500/20">
            <h2 class="mb-3 text-2xl font-extrabold">Cash on Delivery</h2>
            <p class="text-slate-100">
              You will pay <strong>${{ getTotalPrice().toFixed(2) }}</strong> when the order is delivered.
            </p>
          </div>

          <div class="mb-6 rounded-[32px] bg-white/70 p-6 shadow-sm dark:bg-slate-950">
            <h3 class="mb-4 text-xl font-extrabold text-slate-950 dark:text-white">Order Summary</h3>
            <div class="mb-4 space-y-2">
              <div v-for="item in cart" :key="item.id" class="flex justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span>{{ item.title }} (x{{ item.quantity }})</span>
                <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="flex justify-between border-t border-slate-300 pt-4 text-lg font-extrabold text-slate-950 dark:border-slate-800 dark:text-white">
              <span>Total</span>
              <span>${{ getTotalPrice().toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex gap-4">
            <router-link
              to="/checkout"
              class="flex-1 rounded-3xl border border-slate-300/70 bg-white/80 px-6 py-4 text-center font-bold text-slate-800 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              Back
            </router-link>
            <button
              @click="processPayment"
              :disabled="loading"
              class="flex-1 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-500"
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
