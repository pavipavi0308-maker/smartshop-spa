<script setup lang="ts">
import { useAuth } from "../store/auth"

const { user } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">My Profile</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Profile Picture and Basic Info -->
        <div class="md:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <img
              :src="user?.image"
              :alt="user?.firstName"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 class="text-2xl font-bold mb-2">{{ user?.firstName }} {{ user?.lastName }}</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">@{{ user?.username }}</p>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="md:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 class="text-2xl font-bold mb-6">Profile Information</h3>

            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">First Name</p>
                <p class="text-lg font-medium">{{ user?.firstName }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Last Name</p>
                <p class="text-lg font-medium">{{ user?.lastName }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Username</p>
                <p class="text-lg font-medium">{{ user?.username }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p class="text-lg font-medium">{{ user?.email }}</p>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
              <router-link
                to="/"
                class="inline-block px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Back to Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
