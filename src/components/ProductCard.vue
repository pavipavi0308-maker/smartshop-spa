<script setup lang="ts">
import type { Product } from "../types/product"
import { useRouter } from "vue-router"

const router = useRouter()
const props = defineProps<{
  product: Product
}>()

function goToProduct() {
  router.push(`/product/${props.product.id}`)
}
</script>

<template>
  <button
    type="button"
    @click="goToProduct"
    class="group w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <div class="relative overflow-hidden">
      <img
        :src="props.product.thumbnail"
        :alt="props.product.title"
        class="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span
        v-if="props.product.discountPercentage"
        class="absolute left-4 top-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-red-500/20"
      >
        -{{ Math.round(props.product.discountPercentage) }}%
      </span>
    </div>

    <div class="space-y-3 p-5">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 overflow-hidden text-ellipsis" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-clamp:2;">
          {{ props.product.title }}
        </h3>
        <p class="mt-2 text-sm text-slate-500 capitalize">{{ props.product.category }}</p>
      </div>

      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xl font-bold text-slate-900">
            ${{ (props.product.price * (1 - (props.product.discountPercentage ?? 0) / 100)).toFixed(2) }}
          </p>
          <p class="text-sm text-slate-400 line-through">${{ props.product.price.toFixed(2) }}</p>
        </div>
        <div class="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {{ props.product.rating.toFixed(1) }} ⭐
        </div>
      </div>

      <p class="text-sm leading-6 text-slate-500 overflow-hidden text-ellipsis" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-clamp:2;">
        {{ props.product.description }}
      </p>
    </div>
  </button>
</template>