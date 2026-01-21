<script setup lang="ts">
import { ref } from 'vue'
import { BASE_URL } from '@/constants'

const emit = defineEmits<{
  load: [url: string, pageCount: number]
}>()

const pdfs = [
  { url: `${BASE_URL}pdfs/example-1.pdf`, pageCount: 7, label: 'Example 1 (7 pages)' },
  { url: `${BASE_URL}pdfs/example-2.pdf`, pageCount: 230, label: 'Example 2 (230 pages)' },
  { url: `${BASE_URL}pdfs/example-3.pdf`, pageCount: 21, label: 'Example 3 (21 pages)' },
  { url: `${BASE_URL}pdfs/example-4.pdf`, pageCount: 21, label: 'Example 4 (21 pages)' },
]

const selectedIndex = ref(0)

function loadPdf() {
  const pdf = pdfs[selectedIndex.value]!
  emit('load', pdf.url, pdf.pageCount)
}
</script>

<template>
  <form class="flex gap-2 mb-5 w-full h-10" @submit.prevent="loadPdf">
    <select v-model="selectedIndex" class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm">
      <option v-for="(pdf, index) in pdfs" :key="pdf.url" :value="index">
        {{ pdf.label }}
      </option>
    </select>
    <button
      type="submit"
      class="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
    >
      Load
    </button>
  </form>
</template>
