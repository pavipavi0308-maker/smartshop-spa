<script setup lang="ts">
import { useAuth } from "../store/auth"

const { user } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-indigo-100 px-4 py-10 text-slate-950 dark:bg-none dark:bg-slate-800 dark:text-slate-100">
    <div class="mx-auto max-w-6xl">
      <div class="mb-8 rounded-[36px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
        <p class="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-700 dark:text-slate-400">
          Account
        </p>
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          My Profile
        </h1>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div class="rounded-[40px] border border-cyan-200/60 bg-gradient-to-br from-blue-500 via-cyan-500 to-slate-800 p-8 text-center text-white shadow-2xl shadow-sky-500/20 dark:border-slate-800 dark:bg-none dark:bg-slate-950">
          <img
            :src="user?.image"
            :alt="user?.firstName"
            class="mx-auto mb-6 h-36 w-36 rounded-[32px] bg-white/20 object-cover p-2 shadow-xl shadow-slate-950/20"
          />
          <h2 class="mb-2 text-3xl font-extrabold">{{ user?.firstName }} {{ user?.lastName }}</h2>
          <p class="mb-6 text-slate-100">@{{ user?.username }}</p>
          <div class="rounded-[28px] bg-white/15 p-5 text-left">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-100/80">SmartShop member</p>
            <p class="mt-2 text-sm leading-6 text-slate-100">Your shopping profile is ready for faster checkout and saved orders.</p>
          </div>
        </div>

        <div class="rounded-[40px] border border-slate-300/60 bg-slate-400/35 p-8 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
          <h3 class="mb-6 text-3xl font-extrabold text-slate-950 dark:text-white">Profile Information</h3>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-[28px] bg-white/80 p-5 shadow-sm dark:bg-slate-950">
              <p class="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">First Name</p>
              <p class="text-xl font-bold text-slate-950 dark:text-white">{{ user?.firstName }}</p>
            </div>

            <div class="rounded-[28px] bg-white/80 p-5 shadow-sm dark:bg-slate-950">
              <p class="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Last Name</p>
              <p class="text-xl font-bold text-slate-950 dark:text-white">{{ user?.lastName }}</p>
            </div>

            <div class="rounded-[28px] bg-white/80 p-5 shadow-sm dark:bg-slate-950">
              <p class="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Username</p>
              <p class="text-xl font-bold text-slate-950 dark:text-white">{{ user?.username }}</p>
            </div>

            <div class="rounded-[28px] bg-white/80 p-5 shadow-sm dark:bg-slate-950">
              <p class="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">Email</p>
              <p class="break-words text-xl font-bold text-slate-950 dark:text-white">{{ user?.email }}</p>
            </div>
          </div>

          <div class="mt-8 border-t border-slate-300/70 pt-6 dark:border-slate-800">
            <router-link
              to="/"
              class="inline-block rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg shadow-sky-500/20 transition hover:from-blue-700 hover:to-cyan-600"
            >
              Back to Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
