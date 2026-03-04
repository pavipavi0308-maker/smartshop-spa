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

   <div @click="router.push('/cart')" style="cursor:pointer; position:relative;">

  🛒 Cart

  <span
  v-if="cart.length > 0"
  style="
  background:red;
  color:white;
  padding:2px 6px;
  border-radius:50%;
  font-size:12px;
  margin-left:5px;
  ">
  {{ cart.length }}
  </span>

</div>

  </div>
</template>