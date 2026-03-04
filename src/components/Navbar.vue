<script setup lang="ts">
import { useCart } from "../store/cart"
import { useRouter } from "vue-router"



const { cart } = useCart()
const router = useRouter()

function toggleDarkMode() {
  document.documentElement.classList.toggle("dark")
}

</script>

<template>
  <div style="display:flex; justify-content:space-between; padding:15px; background:#222; color:white;">
    
<h2 @click="router.push('/')" style="cursor:pointer;">
SmartShop
</h2>

<div style="display:flex; align-items:center; gap:10px;">

<div @click="router.push('/cart')" style="cursor:pointer;">
🛒 Cart ({{ cart.length }})
</div>

<button
@click="toggleDarkMode"
style="margin-left:15px; padding:5px 10px; border:1px solid #ccc; cursor:pointer;"
>
🌙
</button>

</div>

  </div>
</template>