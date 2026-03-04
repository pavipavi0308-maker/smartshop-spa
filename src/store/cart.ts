import { ref } from "vue"
import type { Product } from "../types/product"

const cart = ref<Product[]>([])

export function useCart() {

  function addToCart(product: Product) {
    cart.value.push(product)
  }

  function removeFromCart(id: number) {
    cart.value = cart.value.filter(p => p.id !== id)
  }

  return {
    cart,
    addToCart,
    removeFromCart
  }
}