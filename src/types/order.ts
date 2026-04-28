import type { Product } from "./product"

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  userId: number
  items: CartItem[]
  totalPrice: number
  totalQuantity: number
  paymentMethod: "card" | "cash"
  status: "pending" | "completed" | "cancelled"
  createdAt: string
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
}

export interface CheckoutData {
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: "card" | "cash"
}

export interface CardPayment {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
}
