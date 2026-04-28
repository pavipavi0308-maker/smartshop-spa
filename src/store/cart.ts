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

function getTotalPrice(): number {
  return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0)
}

function clearCart() {
  cart.value = []
  localStorage.removeItem("cart")
}

function reloadCart() {
  const savedCart = localStorage.getItem("cart")
  cart.value = savedCart ? JSON.parse(savedCart) : []
}

  return {
  cart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  getTotalPrice,
  clearCart,
  reloadCart
  }
}