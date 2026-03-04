<script setup lang="ts">
import { useCart } from "../store/cart"
import { useRouter } from "vue-router"



const { cart } = useCart()
const router = useRouter()
</script>

<template>
  <div style="display:flex; justify-content:space-between; padding:15px; background:#222; color:white;">
    
<h2 @click="router.push('/')" style="cursor:pointer;">
SmartShop
</h2>

    <div @click="router.push('/cart')" style="cursor:pointer;">
  🛒 Cart ({{ cart.length }})
</div>

  </div>
</template>