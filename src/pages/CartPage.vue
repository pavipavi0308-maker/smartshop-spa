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

    <div
      v-for="item in cart"
      :key="item.id"
      style="
      display:grid;
      grid-template-columns:80px 1fr 150px 100px;
      align-items:center;
      gap:15px;
      border:1px solid #ddd;
      padding:10px;
      margin-top:10px;
      "
    >

      <img :src="item.thumbnail" style="width:80px;" />

      <div>
        <h3 style="margin:0;">{{ item.title }}</h3>

        <p style="margin:0; color:red;">
        ${{ item.price }} × {{ item.quantity }} = 
        <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
        </p>



      </div>

      <div style="display:flex; align-items:center; gap:10px;">
        <button @click="decreaseQuantity(item.id)">−</button>
        <span>{{ item.quantity }}</span>
        <button @click="increaseQuantity(item.id)">+</button>
      </div>

      <button @click="removeFromCart(item.id)">Remove</button>

    </div> <!-- ❗ v-for div close -->

    <h2 style="margin-top:20px;">
      Total: ${{ total }}
    </h2>

    <button
     @click="window.alert('Order placed successfully!')"
      style="margin-top:20px; padding:10px 20px; background:green; color:white; border:none;"
    >
      Checkout
    </button>

  </div>
</template>