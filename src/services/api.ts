
import type { Product } from "../types/product"

export async function fetchProducts(skip = 0): Promise<Product[]> {
  const res = await fetch(`https://dummyjson.com/products?limit=20&skip=${skip}`)
  const data = await res.json()
  return data.products
}