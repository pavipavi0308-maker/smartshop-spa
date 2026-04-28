<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useCart } from "../store/cart"

const router = useRouter()
const { cart, getTotalPrice, reloadCart } = useCart()

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
    error.value = "Please fill in all address fields to continue"
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
  <div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 text-slate-950 dark:bg-none dark:bg-slate-800 dark:text-slate-100">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 rounded-[36px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <p class="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-700 dark:text-slate-400">
          Secure checkout
        </p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Checkout
        </h1>
      </div>

      <div class="mb-8 grid grid-cols-2 gap-4 rounded-[32px] border border-slate-300/60 bg-slate-400/35 p-4 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <div :class="['rounded-3xl p-4 text-center font-bold transition', step >= 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300']">
          1. Shipping
        </div>
        <div :class="['rounded-3xl p-4 text-center font-bold transition', step === 2 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300']">
          2. Payment
        </div>
      </div>

      <div v-if="step === 1" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="rounded-[36px] border border-cyan-200/60 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
            <h2 class="mb-6 text-3xl font-extrabold text-slate-950 dark:text-white">Shipping Address</h2>

            <div v-if="error" class="mb-4 rounded-2xl bg-rose-100 p-4 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200">
              {{ error }}
            </div>

            <div class="mb-4">
              <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Street Address</label>
              <input
                v-model="address"
                type="text"
                placeholder="Enter street address"
                class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">City</label>
                <input
                  v-model="city"
                  type="text"
                  placeholder="City"
                  class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Postal Code</label>
                <input
                  v-model="postalCode"
                  type="text"
                  placeholder="Postal Code"
                  class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div class="mb-6">
              <label class="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">Country</label>
              <input
                v-model="country"
                type="text"
                placeholder="Country"
                class="w-full rounded-3xl border border-slate-300/70 bg-white px-5 py-4 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div class="flex flex-wrap justify-between gap-4">
              <router-link
                to="/cart"
                class="rounded-3xl border border-slate-300/70 bg-white/80 px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                Back to Cart
              </router-link>
              <button
                @click="handleNextStep"
                class="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-[36px] border border-cyan-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-6 text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
            <h3 class="mb-6 text-2xl font-extrabold">Order Summary</h3>
            <div class="mb-6 space-y-3 border-b border-white/20 pb-6">
              <div v-for="item in cart" :key="item.id" class="flex justify-between gap-3 text-sm">
                <span class="text-slate-100">{{ item.title }} x{{ item.quantity }}</span>
                <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="flex justify-between text-xl font-extrabold">
              <span>Total</span>
              <span>${{ getTotalPrice().toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="step === 2" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="rounded-[36px] border border-cyan-200/60 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
            <h2 class="mb-6 text-3xl font-extrabold text-slate-950 dark:text-white">Select Payment Method</h2>

            <div class="space-y-4">
              <label :class="['flex cursor-pointer items-center rounded-3xl border-2 p-5 transition', paymentMethod === 'card' ? 'border-cyan-400 bg-white shadow-lg shadow-sky-500/10 dark:bg-slate-900' : 'border-white/70 bg-white/70 hover:bg-white dark:border-slate-700 dark:bg-slate-900']">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="card"
                  class="h-4 w-4 cursor-pointer text-blue-500"
                />
                <div class="ml-4">
                  <div class="font-bold text-slate-950 dark:text-white">Credit/Debit Card</div>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Pay securely with your card</p>
                </div>
              </label>

              <label :class="['flex cursor-pointer items-center rounded-3xl border-2 p-5 transition', paymentMethod === 'cash' ? 'border-cyan-400 bg-white shadow-lg shadow-sky-500/10 dark:bg-slate-900' : 'border-white/70 bg-white/70 hover:bg-white dark:border-slate-700 dark:bg-slate-900']">
                <input
                  v-model="paymentMethod"
                  type="radio"
                  value="cash"
                  class="h-4 w-4 cursor-pointer text-blue-500"
                />
                <div class="ml-4">
                  <div class="font-bold text-slate-950 dark:text-white">Cash on Delivery</div>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Pay when you receive your order</p>
                </div>
              </label>
            </div>

            <div class="mt-8 flex flex-wrap justify-between gap-4">
              <button
                @click="handlePrevStep"
                class="rounded-3xl border border-slate-300/70 bg-white/80 px-6 py-3 font-bold text-slate-800 shadow-sm transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                Back
              </button>
              <button
                @click="handlePayment"
                class="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-[36px] border border-cyan-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-6 text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
            <h3 class="mb-6 text-2xl font-extrabold">Order Summary</h3>
            <div class="mb-6 space-y-3 border-b border-white/20 pb-6">
              <div v-for="item in cart" :key="item.id" class="flex justify-between gap-3 text-sm">
                <span class="text-slate-100">{{ item.title }} x{{ item.quantity }}</span>
                <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="mb-5 flex justify-between text-xl font-extrabold">
              <span>Total</span>
              <span>${{ getTotalPrice().toFixed(2) }}</span>
            </div>
            <div class="rounded-3xl bg-white/15 p-4 text-sm leading-6 text-slate-100">
              <p class="font-bold text-white">Shipping to</p>
              <p>{{ address }}</p>
              <p>{{ city }}, {{ postalCode }}</p>
              <p>{{ country }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
