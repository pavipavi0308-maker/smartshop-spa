import { createApp } from 'vue'
import App from './App.vue'
import router from "./router"
import { useAuth } from "./store/auth"

import './style.css'

const app = createApp(App)

// Initialize auth on app load
const { initializeAuth } = useAuth()
initializeAuth()

app.use(router).mount('#app')