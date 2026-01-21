<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef } from 'vue'
import PdfPagePlaceholder from './pdf-page-placeholder.vue'
import { usePdfContext } from '@/composables/use-pdf-context'

const props = defineProps<{
  pageNumber: number
  width: number
  height: number
}>()

const emit = defineEmits<{
  rendered: [pageNumber: number]
}>()

const { pdf, scale } = usePdfContext()

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const isVisible = ref(false)
const isRendered = ref(false)
const isRendering = ref(false)

let observer: IntersectionObserver | null = null

async function renderPage() {
  if (!pdf.value || isRendered.value || isRendering.value) return

  isRendering.value = true
  console.log(`Rendering page ${props.pageNumber}`)

  try {
    const page = await pdf.value.getPage(props.pageNumber)
    const viewport = page.getViewport({ scale: scale.value })

    const canvas = canvasRef.value
    if (!canvas) return

    const context = canvas.getContext('2d')!
    canvas.height = viewport.height
    canvas.width = viewport.width

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas,
    }).promise

    isRendered.value = true
    emit('rendered', props.pageNumber)
  } catch (err) {
    console.error(`Failed to render page ${props.pageNumber}:`, err)
  } finally {
    isRendering.value = false
  }
}

// Watch for visibility + pdf ready
watch(
  [isVisible, () => pdf.value],
  ([visible, pdfDoc]) => {
    if (visible && pdfDoc && !isRendered.value) {
      renderPage()
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (!containerRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      }
    },
    {
      root: null,
      rootMargin: '1000px',
      threshold: 0,
    },
  )

  observer.observe(containerRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="containerRef">
    <PdfPagePlaceholder v-if="!isRendered" :width="width" :height="height" />
    <canvas ref="canvasRef" v-show="isRendered" class="shadow-lg bg-white max-w-full h-auto" />
  </div>
</template>
