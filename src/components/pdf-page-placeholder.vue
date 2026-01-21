<script setup lang="ts">
defineProps<{
  width: number
  height: number
}>()
</script>

<template>
  <div
    class="shadow-lg bg-white overflow-hidden max-w-full"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div class="p-8 h-full animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-5/6 mb-6"></div>
      <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-4/5 mb-6"></div>
      <div class="h-32 bg-gray-100 rounded w-full mb-6"></div>
      <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div class="h-4 bg-gray-100 rounded w-2/3"></div>
    </div>
  </div>
</template>
