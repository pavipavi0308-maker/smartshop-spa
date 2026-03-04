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

const filteredProducts = computed(() => {
  let list = products.value.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(search.value.toLowerCase())

    const matchCategory =
      selectedCategory.value === "all" ||
      product.category === selectedCategory.value

    return matchSearch && matchCategory
  })

  if (sortOrder.value === "low") {
    list = [...list].sort((a, b) => a.price - b.price)
  }

  if (sortOrder.value === "high") {
    list = [...list].sort((a, b) => b.price - a.price)
  }

  return list
})

onMounted(async () => {
  products.value = await fetchProducts()
  loading.value = false
})

</script>

<template>
  <div>
    <h1>Products</h1>
<div v-if="loading" style="text-align:center; margin-top:40px;">

<div
style="
width:40px;
height:40px;
border:4px solid #ddd;
border-top:4px solid #333;
border-radius:50%;
margin:auto;
animation:spin 1s linear infinite;
"
></div>

<p style="margin-top:10px;">Loading products...</p>

</div>


    <!-- Search -->
    <input
      v-model="search"
      placeholder="Search products..."
      style="padding:8px; width:300px; margin-bottom:20px;"
    />

    <!-- Sort -->
    <select v-model="sortOrder" style="margin-left:20px; padding:5px;">
      <option value="default">Sort</option>
      <option value="low">Price Low → High</option>
      <option value="high">Price High → Low</option>
    </select>

    <!-- Category Filter -->
    <div style="margin-top:20px; margin-bottom:20px;">
      <button
       v-for="cat in categories"
       :key="cat"
       @click="selectedCategory = cat"
       :style="{
       marginRight: '10px',
       padding: '5px 10px',
       background: selectedCategory === cat ? '#333' : '#eee',
       color: selectedCategory === cat ? 'white' : 'black',
       border: 'none',
       cursor: 'pointer'
       }"
       >  
       {{ cat }}
       </button>
       </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">     
        
        <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <p v-if="!loading && filteredProducts.length === 0">
     No products found
    </p>

  </div>
</template>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>