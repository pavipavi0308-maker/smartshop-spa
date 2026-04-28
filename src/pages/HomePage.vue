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
    console.error("Failed to load more products:", error)
  }
}

const categories = ["all", "beauty", "fragrances"]

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
    products.value = await fetchProducts()
  } catch (error) {
    console.error("Failed to load products:", error)
  } finally {
    loading.value = false
  }
})
</script>


<template>

<div class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50 p-5">

  <div class="max-w-7xl mx-auto">

    <section class="rounded-[32px] bg-white/90 border border-slate-200 shadow-2xl shadow-slate-200/40 backdrop-blur-sm p-8 mb-10">
      <div class="text-center max-w-3xl mx-auto">
        <p class="text-sm uppercase tracking-[0.4em] text-blue-600 mb-4">Smart Shop</p>
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">Discover products you’ll love</h1>
        <p class="text-lg leading-8 text-slate-600">Explore top deals, filter by category, and shop smarter with a cleaner product experience.</p>
      </div>

      <div class="mt-10 grid gap-4 lg:grid-cols-[1.6fr_0.9fr] items-center">
        <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <input
            v-model="search"
            placeholder="Search products..."
            class="w-full border border-transparent bg-transparent p-4 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
          />
        </div>

        <select
          v-model="sortOrder"
          class="w-full border border-slate-200 bg-white p-4 rounded-3xl cursor-pointer shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="default">Sort by Price</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>
    </section>

    <div class="flex flex-wrap justify-center gap-4 mb-10">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        class="px-7 py-3 rounded-full capitalize text-sm font-semibold transition-all duration-200"
        :class="selectedCategory === cat
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center mt-20">
      <div class="loader"></div>
      <p class="mt-4 text-slate-500 text-lg">Loading amazing products...</p>
    </div>

    <section v-if="!loading && topDeals.length > 0" class="mb-12">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-900">Top Deals</h2>
          <p class="text-slate-500">Handpicked discounts for you</p>
        </div>
        <span class="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Best values</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in topDeals"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <section v-if="filteredProducts.length > 0" class="mb-12">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 class="text-3xl font-bold text-slate-900">All Products</h2>
        <p class="text-slate-500">Showing {{ filteredProducts.length }} items</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <div
      v-else-if="!loading"
      class="text-center py-20 bg-white rounded-[28px] shadow-lg border border-slate-200"
    >
      <p class="text-xl text-slate-500 mb-4">No products found for "{{ search }}"</p>
      <button
        @click="search = ''; selectedCategory = 'all'"
        class="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition shadow-lg"
      >
        Clear Filters
      </button>
    </div>

    <div
      v-if="hasMore && !loading"
      class="flex justify-center mt-12"
    >
      <button
        @click="loadMore"
        class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-4 rounded-full hover:from-red-600 hover:to-pink-600 transition shadow-2xl shadow-pink-500/20 font-semibold"
      >
        Load More Products
      </button>
    </div>

  </div>

</div>

</template>


<style scoped>

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
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