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

const categories = ["all", "beauty", "fragrances"]

// Corrected Logic: Avoid mutating 'list' directly and use a cleaner flow
const filteredProducts = computed(() => {
  // 1. First Filter (Search + Category)
  let list = products.value.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(search.value.toLowerCase().trim()) // trim() added to avoid space issues

    const matchCategory =
      selectedCategory.value === "all" ||
      product.category === selectedCategory.value

    return matchSearch && matchCategory
  })

  // 2. Then Sort (Create a new array copy to avoid original data mutation)
  if (sortOrder.value === "low") {
    return [...list].sort((a, b) => a.price - b.price)
  }
  if (sortOrder.value === "high") {
    return [...list].sort((a, b) => b.price - a.price)
  }

  return list
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
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-4">Products</h1>

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <input
        v-model="search"
        placeholder="Search products..."
        class="border p-2 rounded w-72 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select v-model="sortOrder" class="border p-2 rounded cursor-pointer">
        <option value="default">Sort by Price</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>
    </div>

    <div class="flex gap-2 mb-6">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        class="px-4 py-2 rounded capitalize transition-colors"
        :class="selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'"
      >
        {{ cat }}
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center mt-10">
      <div class="loader"></div>
      <p class="mt-3 text-gray-500">Loading products...</p>
    </div>

    <template v-else>
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else class="text-center py-10 text-gray-500">
        <p class="text-xl">No products found for "{{ search }}"</p>
        <button @click="search = ''; selectedCategory = 'all'" class="text-blue-500 underline mt-2">
          Clear all filters
        </button>
      </div>
    </template>
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>