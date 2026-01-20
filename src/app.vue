<script setup lang="ts">
import PdfViewer from './components/pdf-viewer.vue'
</script>

<template>
  <div class="max-w-4xl mx-auto p-5 font-sans">
    <header class="mb-5">
      <h1 class="text-2xl font-medium m-0">PDF.js Lazy Loading Demo</h1>
    </header>

    <PdfViewer url="/pdf" :page-count="7" />
  </div>
</template>
