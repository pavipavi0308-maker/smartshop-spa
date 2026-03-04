<script setup lang="ts">
import { useCart } from "../store/cart"
import { useRouter } from "vue-router"



const { cart } = useCart()
const router = useRouter()

import { computed } from "vue"

const cartCount = computed(() => {
  return cart.value.reduce((total, item) => total + item.quantity, 0)
})


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

<div 

@click="router.push('/cart')" 
style="cursor:pointer;"
>
🛒 Cart


<span
v-if="cartCount > 0"
style="
position:absolute;
top:-8px;
right:-12px;
background:red;
color:white;
font-size:12px;
padding:2px 6px;
border-radius:50%;
"
>
{{ cartCount }}
</span>

</div>

<button
@click="toggleDarkMode"
style="margin-left:15px; padding:5px 10px; cursor:pointer;"
>
🌙
</button>

</div>

  </div>
</template>