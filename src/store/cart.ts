import { ref } from "vue"
import type { Product } from "../types/product"

const savedCart = localStorage.getItem("cart")
const cart = ref<Product[]>(savedCart ? JSON.parse(savedCart) : [])

export function useCart() {

  function addToCart(product: Product) {
    cart.value.push(product)
    localStorage.setItem("cart", JSON.stringify(cart.value))
  }

  function removeFromCart(id: number) {
    cart.value = cart.value.filter(p => p.id !== id)
    localStorage.setItem("cart", JSON.stringify(cart.value))
  }

  return {
    cart,
    addToCart,
    removeFromCart
  }
}