import { ref } from "vue"
import type { Product } from "../types/product"
type CartItem = Product & { quantity: number }

const savedCart = localStorage.getItem("cart")
const cart = ref<CartItem[]>(savedCart ? JSON.parse(savedCart) : [])


export function useCart() {

function addToCart(product: Product) {
  const existing = cart.value.find(p => p.id === product.id)

  if (existing) {
    existing.quantity += 1
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart.value))
}


  function removeFromCart(id: number) {
    cart.value = cart.value.filter(p => p.id !== id)
    localStorage.setItem("cart", JSON.stringify(cart.value))
  }

function increaseQuantity(id: number) {
  const item = cart.value.find(p => p.id === id)
  if (item) {
    item.quantity += 1
  }
  localStorage.setItem("cart", JSON.stringify(cart.value))
}

function decreaseQuantity(id: number) {
  const item = cart.value.find(p => p.id === id)

  if (item && item.quantity > 1) {
    item.quantity -= 1
  }

  localStorage.setItem("cart", JSON.stringify(cart.value))
}

  

  return {
  cart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
  }
}