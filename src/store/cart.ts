import { ref } from "vue"
import type { Product } from "../types/product"

const cart = ref<Product[]>([])

export function useCart() {
function addToCart(product: Product) {
  console.log("Added to cart:", product.title)
  cart.value.push(product)
}  

  return {
    cart,
    addToCart
  }
}