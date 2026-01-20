<script setup lang="ts">
import { ref } from 'vue'
import PdfViewer from './components/pdf-viewer.vue'

const currentUrl = ref('/pdf')

const urlInput = ref('/pdf')
const pageCount = ref(7)

function loadPdf() {
  currentUrl.value = urlInput.value
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-5 font-sans">
    <header class="mb-5">
      <h1 class="text-2xl font-medium m-0">PDF.js Lazy Loading Demo</h1>
    </header>

    <form class="flex gap-2 mb-5 w-full h-10" @submit.prevent="loadPdf">
      <input
        v-model="urlInput"
        type="text"
        placeholder="Enter PDF URL"
        class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <input
        v-model.number="pageCount"
        type="number"
        min="1"
        placeholder="Pages"
        class="w-24 px-3 py-2 border border-gray-300 rounded text-sm"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
      >
        Load
      </button>
    </form>

    <PdfViewer :key="currentUrl" :url="currentUrl" :page-count="pageCount" />
  </div>
</template>
