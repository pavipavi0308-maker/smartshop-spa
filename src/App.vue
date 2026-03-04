
<script setup lang="ts">
import Navbar from "./components/Navbar.vue"
</script>


<template>
<div class="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">

  <Navbar />
  <router-view />

</div>
</template>