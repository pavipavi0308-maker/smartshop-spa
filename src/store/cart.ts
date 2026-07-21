import { ref } from "vue"
import type { Product } from "../types/product"
type CartItem = Product & { quantity: number }

function readCart(): CartItem[] {
  const savedCart = localStorage.getItem("cart")
  if (!savedCart) return []

  try {
    const parsed: unknown = JSON.parse(savedCart)
    return Array.isArray(parsed) ? parsed as CartItem[] : []
  } catch {
    localStorage.removeItem("cart")
    return []
  }
}

const cart = ref<CartItem[]>(readCart())


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
  cart.value = readCart()
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
