import { createRouter, createWebHistory } from "vue-router"
import HomePage from "../pages/HomePage.vue"
import ProductDetail from "../pages/ProductDetail.vue"
import CartPage from "../pages/CartPage.vue"
import LoginPage from "../pages/LoginPage.vue"
import RegisterPage from "../pages/RegisterPage.vue"
import CheckoutPage from "../pages/CheckoutPage.vue"
import PaymentPage from "../pages/PaymentPage.vue"
import ProfilePage from "../pages/ProfilePage.vue"

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
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutPage
  },
  {
    path: "/payment",
    name: "payment",
    component: PaymentPage
  },
  {
    path: "/my-profile",
    name: "profile",
    component: ProfilePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router