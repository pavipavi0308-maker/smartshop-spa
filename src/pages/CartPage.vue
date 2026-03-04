<script setup lang="ts">
import { useCart } from "../store/cart"

const { cart } = useCart()
</script>

<template>
  <div style="padding:20px;">
    
    <h1>🛒 Your Cart</h1>

    <div v-if="cart.length === 0">
      Cart is empty
    </div>

    <div v-for="item in cart" :key="item.id" style="border:1px solid #ddd; padding:10px; margin-top:10px;">
      
      <img :src="item.thumbnail" width="80" />

      <h3>{{ item.title }}</h3>

      <p>${{ item.price }}</p>

    </div>

  </div>
</template>