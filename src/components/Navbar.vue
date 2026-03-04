<script setup lang="ts">
import { useCart } from "../store/cart"

const { cart } = useCart()
</script>

<template>
  <div style="display:flex; justify-content:space-between; padding:15px; background:#222; color:white;">
    
    <h2>SmartShop</h2>

    <div>
      🛒 Cart ({{ cart.length }})
    </div>

  </div>
</template>