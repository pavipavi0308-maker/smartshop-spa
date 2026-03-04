<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { fetchProducts } from "../services/api"
import type { Product } from "../types/product"
import ProductCard from "../components/ProductCard.vue"

const products = ref<Product[]>([])
const search = ref("")
const selectedCategory = ref("all")

const categories = ["all", "beauty", "fragrances"]

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(search.value.toLowerCase())

    const matchCategory =
      selectedCategory.value === "all" ||
      product.category === selectedCategory.value

    return matchSearch && matchCategory
  })
})

onMounted(async () => {
  products.value = await fetchProducts()
})
</script>

<template>
  <div>
    <h1>Products</h1>

    <input
      v-model="search"
      placeholder="Search products..."
      style="padding:8px; width:300px; margin-bottom:20px;"
    />

    <div style="margin-bottom:20px;">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        style="margin-right:10px; padding:5px 10px;"
      >
        {{ cat }}
      </button>
    </div>

    <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px;">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>