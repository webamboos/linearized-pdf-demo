import { provide, inject, type ShallowRef, type InjectionKey } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist'

export interface PdfContext {
  pdf: ShallowRef<PDFDocumentProxy | null>
  scale: number
}

const PDF_CONTEXT_KEY: InjectionKey<PdfContext> = Symbol('pdf-context')

export function providePdfContext(context: PdfContext): void {
  provide(PDF_CONTEXT_KEY, context)
}

export function usePdfContext(): PdfContext {
  const context = inject(PDF_CONTEXT_KEY)
  if (!context) {
    throw new Error('usePdfContext must be used within a component that has called providePdfContext')
  }
  return context
}
