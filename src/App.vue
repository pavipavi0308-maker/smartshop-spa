
<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import Navbar from "./components/Navbar.vue"

const route = useRoute()
const hideNavbar = computed(() => route.path === "/login" || route.path === "/register")
</script>


<template>
<div class="bg-white dark:bg-slate-900 text-black dark:text-white min-h-screen">

  <Navbar v-if="!hideNavbar" />
  <router-view />

</div>
</template>
