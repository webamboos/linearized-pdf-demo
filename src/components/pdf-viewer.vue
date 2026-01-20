<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href

const props = defineProps<{
  url: string
  pageCount: number
}>()

const container = ref<HTMLDivElement | null>(null)
const pagesLoaded = ref(0)
const status = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')

const SCALE = 1.5
const ESTIMATED_PAGE_WIDTH = 612 * SCALE
const ESTIMATED_PAGE_HEIGHT = 792 * SCALE

class RangeTransport extends pdfjsLib.PDFDataRangeTransport {
  private url: string

  constructor(length: number, url: string) {
    super(length, new Uint8Array(0))
    this.url = url
  }

  requestDataRange(begin: number, end: number): void {
    console.log(`Range request: bytes=${begin}-${end - 1}`)

    fetch(this.url, {
      headers: { Range: `bytes=${begin}-${end - 1}` },
    })
      .then((response) => {
        if (!response.ok && response.status !== 206) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.arrayBuffer()
      })
      .then((buffer) => {
        this.onDataRange(begin, new Uint8Array(buffer))
      })
      .catch((err) => {
        console.error('Range request failed:', err)
      })
  }
}

let pdf: PDFDocumentProxy | null = null
let observer: IntersectionObserver | null = null
const renderedPages = new Set<number>()
const renderingPages = new Set<number>()
const pendingPages = new Map<number, HTMLDivElement>() // Pages waiting for PDF to load

async function renderPage(pageNum: number, placeholder: HTMLDivElement) {
  // If PDF isn't loaded yet, queue the page for later
  if (!pdf) {
    pendingPages.set(pageNum, placeholder)
    return
  }

  if (renderedPages.has(pageNum) || renderingPages.has(pageNum)) return

  renderingPages.add(pageNum)
  console.log(`Rendering page ${pageNum}`)

  try {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: SCALE })

    const canvas = document.createElement('canvas')
    canvas.className = 'shadow-lg bg-white'
    const context = canvas.getContext('2d')!
    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas,
    }).promise

    placeholder.replaceWith(canvas)

    renderedPages.add(pageNum)
    pagesLoaded.value = renderedPages.size
  } catch (err) {
    console.error(`Failed to render page ${pageNum}:`, err)
  } finally {
    renderingPages.delete(pageNum)
  }
}

// Render pages that were queued while PDF was loading
async function renderPendingPages() {
  for (const [pageNum, placeholder] of pendingPages) {
    await renderPage(pageNum, placeholder)
  }
  pendingPages.clear()
}

onMounted(async () => {
  if (!container.value) return

  const placeholders: HTMLDivElement[] = []
  for (let pageNum = 1; pageNum <= props.pageCount; pageNum++) {
    const placeholder = document.createElement('div')
    placeholder.className = 'shadow-lg bg-white overflow-hidden'
    placeholder.style.width = `${ESTIMATED_PAGE_WIDTH}px`
    placeholder.style.height = `${ESTIMATED_PAGE_HEIGHT}px`
    placeholder.dataset.pageNum = String(pageNum)
    placeholder.innerHTML = `
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
    `
    container.value.appendChild(placeholder)
    placeholders.push(placeholder)
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const placeholder = entry.target as HTMLDivElement
          const pageNum = parseInt(placeholder.dataset.pageNum!, 10)
          renderPage(pageNum, placeholder)
          observer?.unobserve(placeholder)
        }
      }
    },
    {
      root: null,
      rootMargin: '1000px',
      threshold: 0,
    }
  )

  for (const placeholder of placeholders) {
    observer.observe(placeholder)
  }

  try {
    const headResponse = await fetch(props.url, { method: 'HEAD' })
    const contentLength = headResponse.headers.get('Content-Length')
    if (!contentLength) {
      throw new Error('Server did not return Content-Length header')
    }
    const length = parseInt(contentLength, 10)

    const transport = new RangeTransport(length, props.url)

    const loadingTask = pdfjsLib.getDocument({
      range: transport,
      disableAutoFetch: true,
      disableStream: true,
    })

    pdf = await loadingTask.promise
    status.value = 'ready'

    // Render any pages that were visible before PDF loaded
    await renderPendingPages()
  } catch (error) {
    status.value = 'error'
    errorMessage.value = String(error)
    console.error('PDF loading error:', error)
  }
})

onUnmounted(() => {
  observer?.disconnect()
  pdf?.destroy()
})
</script>

<template>
  <div class="w-full font-sans">
    <div class="mb-3 text-sm">
      <span v-if="status === 'loading'" class="text-gray-500"
        >Loading PDF...</span
      >
      <span v-else-if="status === 'error'" class="text-red-600">{{
        errorMessage
      }}</span>
      <span v-else class="text-blue-500"
        >Pages rendered: {{ pagesLoaded }} / {{ pageCount }}</span
      >
    </div>
    <div ref="container" class="flex flex-col gap-5 items-center"></div>
  </div>
</template>
