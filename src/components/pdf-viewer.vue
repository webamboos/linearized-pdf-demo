<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import PdfPage from './pdf-page.vue'
import { PdfRangeTransport } from '@/lib/pdf-range-transport'
import { providePdfContext } from '@/composables/use-pdf-context'
import { isPdfLinearized } from '@/lib/check-linearized'
import { useResponsivePdf } from '@/composables/use-responsive-pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href

const props = defineProps<{
  url: string
  pageCount: number
}>()

const pdf = shallowRef<PDFDocumentProxy | null>(null)
const pagesLoaded = ref(0)
const status = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')
const loadingMethod = ref<'incremental' | 'full'>('incremental')

// Use responsive PDF dimensions
const { scale, estimatedPageWidth, estimatedPageHeight } = useResponsivePdf()

// Provide pdf context to child components
providePdfContext({ pdf, scale })

function onPageRendered() {
  pagesLoaded.value++
}

onMounted(async () => {
  try {
    // Check if the PDF is linearized (optimized for incremental loading)
    const isLinearized = await isPdfLinearized(props.url)

    if (isLinearized) {
      // Use incremental loading for linearized PDFs
      console.log('PDF is linearized, using incremental loading')
      loadingMethod.value = 'incremental'

      const headResponse = await fetch(props.url, { method: 'HEAD' })
      const contentLength = headResponse.headers.get('Content-Length')
      if (!contentLength) {
        throw new Error('Server did not return Content-Length header')
      }
      const length = parseInt(contentLength, 10)

      const transport = new PdfRangeTransport(length, props.url)

      const loadingTask = pdfjsLib.getDocument({
        range: transport,
        disableAutoFetch: true,
        disableStream: true,
      })

      pdf.value = await loadingTask.promise
    } else {
      // Use full file loading for non-linearized PDFs
      console.log('PDF is not linearized, loading full file')
      loadingMethod.value = 'full'

      const loadingTask = pdfjsLib.getDocument(props.url)
      pdf.value = await loadingTask.promise
    }

    status.value = 'ready'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = String(error)
    console.error('PDF loading error:', error)
  }
})

onUnmounted(() => {
  pdf.value?.destroy()
})
</script>

<template>
  <div class="w-full font-sans">
    <div class="mb-3 text-sm">
      <span v-if="status === 'loading'" class="text-gray-500"> Loading PDF... </span>
      <span v-else-if="status === 'error'" class="text-red-600">{{ errorMessage }}</span>
      <span v-else class="text-blue-500">
        Pages rendered: {{ pagesLoaded }} / {{ pageCount }}
        <span class="ml-2 text-gray-500">
          ({{ loadingMethod === 'incremental' ? 'incremental loading' : 'full file loading' }})
        </span>
      </span>
    </div>
    <div class="flex flex-col gap-5 items-center">
      <PdfPage
        v-for="pageNum in pageCount"
        :key="pageNum"
        :page-number="pageNum"
        :width="estimatedPageWidth()"
        :height="estimatedPageHeight()"
        @rendered="onPageRendered"
      />
    </div>
  </div>
</template>
