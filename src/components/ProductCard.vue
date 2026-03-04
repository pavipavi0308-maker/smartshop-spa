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

style="border:1px solid #eee; padding:15px; border-radius:8px; background:white; cursor:pointer; position:relative; transition:transform 0.3s, box-shadow 0.3s;"


onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'"

onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"
>

<span
v-if="props.product.discountPercentage"
style="
position:absolute;
top:10px;
left:10px;
background:red;
color:white;
padding:3px 6px;
font-size:12px;
border-radius:4px;
"
>
-{{ props.product.discountPercentage }}%
</span>


   <img :src="props.product.thumbnail" style="width:100%; height:150px; object-fit:cover;" />

    <h3 style="font-size:16px; margin-top:10px; height:40px; overflow:hidden;">
    {{ props.product.title }}
    </h3>


    <div style="margin-top:5px;">

    <p style="color:red; font-weight:bold;">
    ${{ (props.product.price * (1 - props.product.discountPercentage / 100)).toFixed(2) }}
    </p>

    <p style="text-decoration:line-through; color:gray; font-size:13px;">
    ${{ props.product.price }}
    </p>

    </div>
    
   
    <p style="color:orange;">
    ⭐ {{ props.product.rating }}
    </p>

  </div>
</template>