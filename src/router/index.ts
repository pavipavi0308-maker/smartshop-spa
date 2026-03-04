import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../pages/HomePage.vue"
import ProductDetail from "../pages/ProductDetail.vue"


const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage
  },
  {
  path: "/product/:id",
  name: "product",
  component: ProductDetail
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router