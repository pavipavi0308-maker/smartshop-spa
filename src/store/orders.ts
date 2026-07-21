import { ref } from "vue"
import type { Order } from "../types/order"

function readOrders(): Order[] {
  const savedOrders = localStorage.getItem("orders")
  if (!savedOrders) return []

  try {
    const parsed: unknown = JSON.parse(savedOrders)
    return Array.isArray(parsed) ? parsed as Order[] : []
  } catch {
    localStorage.removeItem("orders")
    return []
  }
}

const orders = ref<Order[]>(readOrders())

export function useOrders() {
  function addOrder(order: Order) {
    orders.value.push(order)
    localStorage.setItem("orders", JSON.stringify(orders.value))
  }

  function getUserOrders(userId: number): Order[] {
    return orders.value.filter(order => order.userId === userId)
  }

  function getOrderById(orderId: string): Order | undefined {
    return orders.value.find(order => order.id === orderId)
  }

  function updateOrderStatus(orderId: string, status: "pending" | "completed" | "cancelled") {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      localStorage.setItem("orders", JSON.stringify(orders.value))
    }
  }

  return {
    orders,
    addOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
  }
}
