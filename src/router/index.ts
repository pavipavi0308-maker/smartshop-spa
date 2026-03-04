import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../pages/HomePage.vue"
import ProductDetail from "../pages/ProductDetail.vue"
import CartPage from "../pages/CartPage.vue"



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
  },

  {
  path: "/cart",
  name: "cart",
  component: CartPage
}




]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router