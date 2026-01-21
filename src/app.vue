<script setup lang="ts">
import { ref } from 'vue'
import PdfViewer from './components/pdf-viewer.vue'
import PdfSelector from './components/pdf-selector.vue'
import { BASE_URL } from './constants'

const currentUrl = ref(`${BASE_URL}pdfs/example-1.pdf`)
const pageCount = ref(7)

function onLoad(url: string, pages: number) {
  currentUrl.value = url
  pageCount.value = pages
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 font-sans">
    <header class="mb-5">
      <h1 class="text-xl sm:text-2xl font-medium m-0">PDF.js Lazy Loading Demo</h1>
    </header>

    <PdfSelector @load="onLoad" />

    <PdfViewer :key="currentUrl" :url="currentUrl" :page-count="pageCount" />
  </div>
</template>
