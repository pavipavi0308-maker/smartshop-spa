<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { fetchProducts } from "../services/api"
import type { Product } from "../types/product"
import ProductCard from "../components/ProductCard.vue"

const products = ref<Product[]>([])
const search = ref("")
const selectedCategory = ref("all")
const sortOrder = ref("default")
const loading = ref(true)

const skip = ref(0)
const hasMore = ref(true)

const fallbackProducts: Product[] = [
  {
    id: 1001,
    title: "Essence Mascara Lash Princess",
    description: "A lightweight mascara with bold definition for everyday looks.",
    price: 9.99,
    discountPercentage: 12,
    rating: 4.8,
    stock: 42,
    brand: "Essence",
    category: "beauty",
    thumbnail: "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    images: []
  },
  {
    id: 1002,
    title: "Chanel Coco Noir Eau De",
    description: "A rich fragrance with a polished, long-lasting finish.",
    price: 129.99,
    discountPercentage: 18,
    rating: 4.4,
    stock: 16,
    brand: "Chanel",
    category: "fragrances",
    thumbnail: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
    images: []
  },
  {
    id: 1003,
    title: "Annibale Colombo Bed",
    description: "A modern bed frame designed for a calm, refined bedroom.",
    price: 1899.99,
    discountPercentage: 11,
    rating: 4.7,
    stock: 8,
    brand: "Annibale Colombo",
    category: "furniture",
    thumbnail: "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
    images: []
  },
  {
    id: 1004,
    title: "Fresh Mangoes",
    description: "Sweet, juicy mangoes picked for fresh daily snacking.",
    price: 12.99,
    discountPercentage: 15,
    rating: 4.6,
    stock: 64,
    brand: "Fresh Farms",
    category: "groceries",
    thumbnail: "https://cdn.dummyjson.com/product-images/groceries/mangoes/thumbnail.webp",
    images: []
  }
]

async function loadMore() {
  skip.value += 20

  try {
    const more = await fetchProducts(skip.value)

    if (more.length === 0) {
      hasMore.value = false
      return
    }

    products.value.push(...more)

  } catch (error) {
    hasMore.value = false
  }
}

const categories = ["all", "beauty", "fragrances", "furniture", "groceries"]

const filteredProducts = computed(() => {

  let list = products.value.filter((product) => {

    const matchSearch = (product.title ?? "")
      .toLowerCase()
      .includes(search.value.toLowerCase().trim())

    const matchCategory =
      selectedCategory.value === "all" ||
      product.category === selectedCategory.value

    return matchSearch && matchCategory
  })

  if (sortOrder.value === "low") {
    return [...list].sort((a, b) => a.price - b.price)
  }

  if (sortOrder.value === "high") {
    return [...list].sort((a, b) => b.price - a.price)
  }

  return list
})

const topDeals = computed(() => {
  return products.value
    .filter(p => (p.discountPercentage ?? 0) > 10)
    .slice(0, 4)
})

onMounted(async () => {
  try {
    const fetchedProducts = await fetchProducts()
    products.value = fetchedProducts.length > 0 ? fetchedProducts : fallbackProducts
    hasMore.value = fetchedProducts.length > 0
  } catch (error) {
    products.value = fallbackProducts
    hasMore.value = false
  } finally {
    loading.value = false
  }
})
</script>


<template>
  <div class="min-h-screen bg-linear-to-br from-sky-100 via-cyan-100 to-indigo-100 text-slate-900 dark:bg-none dark:bg-slate-800 dark:text-slate-100">
    <div class="mx-auto px-5 py-10 md:px-8">
      <section class="grid gap-8 rounded-[40px] border border-slate-300/60 bg-slate-400/35 p-8 text-slate-900 shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.4fr_1fr] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:shadow-slate-950/30">
        <div class="hero-left-panel space-y-6 rounded-4xl border border-cyan-200/60 bg-linear-to-br from-blue-600 via-cyan-500 to-slate-900 p-6 text-white shadow-xl shadow-sky-500/20 lg:p-8 dark:border-slate-800 dark:bg-none dark:bg-slate-950 dark:shadow-slate-950/30">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-sm dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700">
            <span class="h-2.5 w-2.5 rounded-full bg-sky-600"></span>
            Smart Shop for modern shopping
          </span>

          <div class="space-y-4">
            <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Discover products you’ll love — faster.</h1>
            <p class="max-w-2xl text-lg leading-8 text-slate-100 dark:text-slate-300">Browse expertly curated deals, compare prices instantly, and shop smarter with our clean, effortless storefront.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-[28px] border border-white/10 bg-white/15 p-5 shadow-sm backdrop-blur-sm dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100">
              <p class="text-sm uppercase tracking-[0.24em] text-slate-200 dark:text-slate-400">24/7 support</p>
              <p class="mt-3 text-base font-semibold text-white dark:text-slate-100">Here to help anytime.</p>
            </div>
            <div class="rounded-[28px] border border-white/10 bg-white/15 p-5 shadow-sm backdrop-blur-sm dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100">
              <p class="text-sm uppercase tracking-[0.24em] text-slate-200 dark:text-slate-400">Fast shipping</p>
              <p class="mt-3 text-base font-semibold text-white dark:text-slate-100">Delivered quickly to your door.</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-[1.25fr_0.75fr]">
            <div class="rounded-[28px] border border-white/10 bg-white/15 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100">
              <label class="mb-2 block text-sm font-medium text-slate-100 dark:text-slate-400">Search products</label>
              <input
                v-model="search"
                placeholder="Search products..."
                class="w-full rounded-3xl border border-slate-300/70 bg-white/90 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-400/20"
              />
            </div>
            <div class="rounded-[28px] border border-white/10 bg-white/15 p-4 shadow-sm backdrop-blur-sm dark:bg-slate-700 dark:border-slate-700 dark:text-slate-100">
              <label class="mb-2 block text-sm font-medium text-slate-100 dark:text-slate-400">Sort by price</label>
              <select
                v-model="sortOrder"
                class="w-full cursor-pointer rounded-3xl border border-slate-300/70 bg-white/90 px-5 py-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400/20"
              >
                <option value="default">Default</option>
                <option value="low">Low → High</option>
                <option value="high">High → Low</option>
              </select>
            </div>
          </div>
        </div>

        <div class="space-y-4 rounded-4xl bg-linear-to-br from-blue-600 via-cyan-500 to-slate-900 p-8 text-white shadow-xl shadow-sky-500/20 dark:bg-none dark:bg-slate-950 dark:shadow-none">
          <div class="space-y-3">
            <p class="text-sm uppercase tracking-[0.3em] text-sky-100/80">Featured benefits</p>
            <h2 class="text-3xl font-semibold tracking-tight">Get the best deals every day</h2>
            <p class="text-slate-100/90">Our homepage helps you find top discounts, trusted products, and a fast checkout flow without distraction.</p>
          </div>

          <div class="space-y-4 rounded-[28px] bg-white/10 p-5">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">✓</span>
              <div>
                <p class="font-semibold">Easy browsing</p>
                <p class="text-sm text-slate-200/80">Search, filter, and sort in seconds.</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">⚡</span>
              <div>
                <p class="font-semibold">Curated deals</p>
                <p class="text-sm text-slate-200/80">Top discounts selected for you.</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">💳</span>
              <div>
                <p class="font-semibold">Secure checkout</p>
                <p class="text-sm text-slate-200/80">Safe payments every time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-10 flex flex-wrap justify-center gap-3 rounded-4xl border border-slate-300/40 bg-slate-400/25 px-4 py-5 shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          class="rounded-full px-6 py-3 text-sm font-semibold transition duration-200"
          :class="selectedCategory === cat
            ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30 dark:from-blue-500 dark:to-cyan-400'
            : 'bg-white/85 text-slate-800 border border-white/70 shadow-sm hover:bg-white dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700'"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
        <div class="loader"></div>
        <p class="mt-4 text-slate-500 text-lg">Loading amazing products...</p>
      </div>

      <section v-if="!loading && topDeals.length > 0" class="mt-12 rounded-4xl border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-slate-950 dark:text-slate-100">Top Deals</h2>
            <p class="text-slate-700 dark:text-slate-400">Handpicked discounts for you</p>
          </div>
          <span class="rounded-full bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 dark:from-slate-800 dark:to-slate-700">Best values</span>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="product in topDeals" :key="product.id" :product="product" />
        </div>
      </section>

      <section v-if="filteredProducts.length > 0" class="mt-12 rounded-4xl border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 class="text-3xl font-bold text-slate-950 dark:text-slate-100">All Products</h2>
            <p class="text-slate-700 dark:text-slate-400">Showing {{ filteredProducts.length }} items</p>
          </div>
          <div class="rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-300">Browse the latest collection with smart sorting and filtering.</div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>
      </section>

      <div v-else-if="!loading" class="mt-12 rounded-4xl bg-white/90 border border-slate-200 p-10 text-center shadow-2xl shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-900/90">
        <p class="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">No products found for "{{ search }}"</p>
        <p class="text-slate-500 dark:text-slate-400 mb-8">Try another search term or reset filters to explore more items.</p>
        <button
          @click="search = ''; selectedCategory = 'all'"
          class="inline-flex rounded-full bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700"
        >
          Clear Filters
        </button>
      </div>

      <div v-if="hasMore && !loading" class="mt-10 flex justify-center">
        <button
          @click="loadMore"
          class="rounded-full bg-linear-to-r from-red-500 to-pink-500 px-10 py-4 text-white shadow-2xl shadow-pink-500/20 transition hover:from-red-600 hover:to-pink-600"
        >
          Load More Products
        </button>
      </div>

      <footer class="mt-14 overflow-hidden rounded-[40px] border border-slate-300/60 bg-slate-400/35 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <div class="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p class="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-slate-700 dark:text-slate-400">
              Secure payments
            </p>
            <div class="flex flex-wrap gap-3">
              <span class="rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">VISA</span>
              <span class="rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">Mastercard</span>
              <span class="rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">PayPal</span>
              <span class="rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">Apple Pay</span>
              <span class="rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">Google Pay</span>
              <span class="rounded-2xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm">Amex</span>
            </div>
          </div>

          <div class="flex flex-col gap-4 lg:items-end">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Shop on the go with the SmartShop app
            </p>
            <div class="flex flex-wrap gap-3">
              <button class="rounded-2xl bg-slate-950 px-5 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                App Store
              </button>
              <button class="rounded-2xl bg-slate-950 px-5 py-3 text-left text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                Google Play
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-white/30 bg-white/45 px-8 py-6 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <div class="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>SmartShop</span>
            <span>Help Center</span>
            <span>Shipping</span>
            <span>Returns</span>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            © 2026 SmartShop. Shop smarter, faster.
          </p>
        </div>
      </footer>

  </div>

</div>

</template>


<style scoped>

.loader {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(148, 163, 184, 0.35);
  border-top-color: #2563eb;
  border-radius: 9999px;
  animation: spin 1s linear infinite;
}

@keyframes spin {

  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }

}

</style>
