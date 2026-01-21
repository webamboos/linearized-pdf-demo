import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable to calculate responsive PDF dimensions based on container width
 */
export function useResponsivePdf() {
  const containerWidth = ref(0)
  const scale = ref(1.5)

  // Standard US Letter dimensions in points (72 points = 1 inch)
  const PDF_PAGE_WIDTH = 612
  const PDF_PAGE_HEIGHT = 792

  function updateDimensions() {
    // Get the actual container width
    const maxWidth = window.innerWidth
    const padding = 40 // Account for page padding
    const availableWidth = Math.min(maxWidth - padding, 1200) // Max width of 1200px

    // Calculate scale to fit the page width
    const targetWidth = Math.min(availableWidth, PDF_PAGE_WIDTH * 1.5)
    scale.value = targetWidth / PDF_PAGE_WIDTH

    containerWidth.value = targetWidth
  }

  onMounted(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  return {
    scale,
    estimatedPageWidth: () => PDF_PAGE_WIDTH * scale.value,
    estimatedPageHeight: () => PDF_PAGE_HEIGHT * scale.value,
  }
}
