<script setup lang="ts">
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import type { Product } from "../types/product"

const route = useRoute()
const product = ref<Product | null>(null)

onMounted(async () => {
  const res = await fetch(`https://dummyjson.com/products/${route.params.id}`)
  const data = await res.json()
  product.value = data
})
</script>

<template>
  <div
   v-if="product" style="padding:20px; display:flex; gap:40px;">
  
   <button @click="$router.push('/')" style="margin-bottom:20px;">
    ← Back to Products
     </button>

    <img :src="product.thumbnail" style="width:300px;" />

    <div>
      <h1>{{ product.title }}</h1>

      <p style="color:red; font-size:20px;">
        ${{ product.price }}
      </p>

      <p>{{ product.description }}</p>

      <p>⭐ Rating: {{ product.rating }}</p>

    </div>

  </div>
</template>