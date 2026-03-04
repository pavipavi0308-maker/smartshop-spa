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
 <div
@click="goToProduct"
style="border:1px solid #eee; padding:15px; border-radius:8px; background:white; cursor:pointer; transition:0.3s;"
onmouseover="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.15)'"
onmouseout="this.style.boxShadow='none'"
>
    <img :src="props.product.thumbnail" style="width:100%; height:150px; object-fit:cover;" />

    <h3 style="font-size:16px; margin-top:10px;">
        {{ props.product.title }}
    </h3>

    <p style="color:red; font-weight:bold;">
        ${{ props.product.price }}
    </p>

  </div>
</template>