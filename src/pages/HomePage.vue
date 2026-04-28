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

<div class="min-h-screen bg-gray-50 p-5">

  <div class="max-w-7xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Discover Amazing Products</h1>
      <p class="text-gray-600">Find the best deals and latest trends</p>
    </div>

    <!-- Search + Sort -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">

      <input
        v-model="search"
        placeholder="Search products..."
        class="flex-1 border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <select
        v-model="sortOrder"
        class="border border-gray-300 p-3 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="default">Sort by Price</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>

    </div>

    <!-- Category Buttons -->
    <div class="flex gap-3 mb-8 flex-wrap justify-center">

      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        class="px-6 py-3 rounded-full capitalize transition-all duration-200 font-medium"
        :class="selectedCategory === cat
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'"
      >
        {{ cat }}
      </button>

    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center mt-20">

      <div class="loader"></div>

      <p class="mt-4 text-gray-500 text-lg">
        Loading amazing products...
      </p>

    </div>

    <!-- Top Deals -->
    <section v-if="!loading && topDeals.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span class="text-red-500">🔥</span> Top Deals
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <ProductCard
          v-for="product in topDeals"
          :key="product.id"
          :product="product"
        />

      </div>
    </section>

    <!-- Products -->
    <section v-if="filteredProducts.length > 0" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">All Products</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />

      </div>
    </section>

    <!-- No Products -->
    <div
      v-else-if="!loading"
      class="text-center py-20 bg-white rounded-lg shadow-sm"
    >

      <p class="text-xl text-gray-500 mb-4">
        No products found for "{{ search }}"
      </p>

      <button
        @click="search = ''; selectedCategory = 'all'"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Clear Filters
      </button>

    </div>

    <!-- Load More -->
    <div
      v-if="hasMore && !loading"
      class="flex justify-center mt-12"
    >

      <button
        @click="loadMore"
        class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-red-600 hover:to-pink-600 transition shadow-lg font-medium"
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