<script setup lang="ts">
import type { Product } from "../types/product"

defineProps<{
  product: Product
}>()
</script>

<template>
  <div 
style="border:1px solid #eee; padding:15px; border-radius:8px; background:white; transition:0.3s;"
onmouseover="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.15)'"
onmouseout="this.style.boxShadow='none'"
>
    <img :src="product.thumbnail" style="width:100%; height:150px; object-fit:cover;" />

    <h3 style="font-size:16px; margin-top:10px;">
      {{ product.title }}
    </h3>

    <p style="color:red; font-weight:bold;">
      ${{ product.price }}
    </p>

  </div>
</template>