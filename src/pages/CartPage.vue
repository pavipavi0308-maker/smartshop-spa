<script setup lang="ts">
import { useCart } from "../store/cart"
import { useAuth } from "../store/auth"
import { useRouter } from "vue-router"
import { computed, onMounted } from "vue"

const { cart, removeFromCart, increaseQuantity, decreaseQuantity, getTotalPrice, reloadCart } = useCart()
const { isAuthenticated } = useAuth()
const router = useRouter()

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
  <div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 text-slate-950 dark:bg-none dark:bg-slate-800 dark:text-slate-100">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 rounded-[36px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <p class="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-700 dark:text-slate-400">
          Shopping bag
        </p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Your Cart
        </h1>
      </div>

      <div v-if="cart.length === 0" class="rounded-[40px] border border-cyan-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-10 text-center text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold">
          0
        </div>
        <h2 class="mb-3 text-3xl font-extrabold">Your Cart is Empty</h2>
        <p class="mx-auto mb-8 max-w-xl text-slate-100">
          Looks like you haven't added anything yet. Browse products and bring your favorites back here.
        </p>
        <button
          @click="continueShopping"
          class="rounded-3xl bg-white px-8 py-4 font-bold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
        >
          Continue Shopping
        </button>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="space-y-5 lg:col-span-2">
          <div
            v-for="item in cart"
            :key="item.id"
            class="rounded-[32px] border border-slate-300/60 bg-slate-400/35 p-5 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="grid gap-5 sm:grid-cols-[120px_1fr_auto]">
              <img
                :src="item.thumbnail"
                :alt="item.title"
                class="h-28 w-28 rounded-3xl bg-white object-cover p-2 shadow-sm"
              />

              <div>
                <h3 class="mb-2 text-xl font-bold text-slate-950 dark:text-white">{{ item.title }}</h3>
                <p class="mb-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {{ item.description.substring(0, 110) }}...
                </p>
                <p class="text-2xl font-extrabold text-slate-950 dark:text-white">
                  ${{ item.price.toFixed(2) }}
                </p>
              </div>

              <div class="flex flex-col items-start gap-4 sm:items-end">
                <div class="flex items-center overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <button
                    @click="decreaseQuantity(item.id)"
                    class="px-4 py-2 font-bold transition hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span class="px-4 py-2 font-bold">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item.id)"
                    class="px-4 py-2 font-bold transition hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>

                <button
                  @click="removeFromCart(item.id)"
                  class="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                >
                  Remove
                </button>

                <div class="text-left sm:text-right">
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-400">Subtotal</p>
                  <p class="text-2xl font-extrabold text-slate-950 dark:text-white">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="sticky top-24 rounded-[36px] border border-cyan-200/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-slate-900 p-6 text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
            <h3 class="mb-6 text-2xl font-extrabold">Order Summary</h3>

            <div class="mb-6 space-y-3 border-b border-white/20 pb-6">
              <div v-for="item in cart" :key="item.id" class="flex justify-between gap-3 text-sm">
                <span class="text-slate-100">{{ item.title.substring(0, 25) }}... x {{ item.quantity }}</span>
                <span class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="mb-6 space-y-3">
              <div class="flex justify-between">
                <span class="text-slate-100">Subtotal</span>
                <span class="font-semibold">${{ total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-100">Shipping</span>
                <span class="font-semibold text-emerald-100">Free</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-100">Tax</span>
                <span class="font-semibold">${{ (total * 0.1).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t border-white/20 pt-4 text-xl font-extrabold">
                <span>Total</span>
                <span>${{ (total + total * 0.1).toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button
                @click="handleCheckout"
                class="w-full rounded-3xl bg-white px-6 py-4 font-bold text-slate-950 shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
              >
                {{ isAuthenticated ? "Proceed to Checkout" : "Login to Checkout" }}
              </button>
              <button
                @click="continueShopping"
                class="w-full rounded-3xl border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Continue Shopping
              </button>
            </div>

            <p v-if="!isAuthenticated" class="mt-4 text-center text-sm text-slate-100">
              <router-link to="/login" class="font-bold underline underline-offset-4 hover:no-underline">
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
