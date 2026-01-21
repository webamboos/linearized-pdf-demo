import { mount } from '@vue/test-utils'
import { shallowRef, ref, type Component } from 'vue'
import { providePdfContext } from '@/composables/use-pdf-context'
import { createMockPDFDocument } from './mock-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'

interface MountWithPdfContextOptions {
  pdf?: PDFDocumentProxy
  scale?: number
  [key: string]: any
}

export function mountWithPdfContext(
  component: Component,
  options: MountWithPdfContextOptions = {},
) {
  const { pdf, scale = 1.5, ...mountOptions } = options

  return mount(component, {
    ...mountOptions,
    global: {
      ...mountOptions.global,
      provide: {
        ...mountOptions.global?.provide,
        'pdf-context': {
          pdf: shallowRef(pdf || createMockPDFDocument()),
          scale: ref(scale),
        },
      },
    },
  })
}
