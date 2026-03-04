<script setup lang="ts">
import { useCart } from "../store/cart"
import { computed } from "vue"


const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})


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
      
     <div style="display:flex; align-items:center; gap:10px;">
     <button @click="decreaseQuantity(item.id)">−</button>

     <span>Qty: {{ item.quantity }}</span>

     <button @click="increaseQuantity(item.id)">+</button>
     </div>

      <button
       @click="removeFromCart(item.id)"
       style="margin-top:10px; padding:5px 10px; background:red; color:white; border:none;"
       >
       Remove
       </button>
     </div>

     <h2 style="margin-top:20px;">
       Total: ${{ total }}
       </h2>

    <button
    @click="alert('Order placed successfully!')"
    style="margin-top:20px; padding:10px 20px; background:green; color:white; border:none;"
    >
    Checkout
    </button> 

  </div>
</template>