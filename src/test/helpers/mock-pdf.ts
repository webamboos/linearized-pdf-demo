import { vi } from 'vitest'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'

export function createMockPDFPage(pageNumber: number): PDFPageProxy {
  return {
    pageNumber,
    getViewport: vi.fn((params: { scale: number }) => ({
      width: 612 * params.scale,
      height: 792 * params.scale,
      scale: params.scale,
    })),
    render: vi.fn(() => ({
      promise: Promise.resolve(),
    })),
    cleanup: vi.fn(),
    getAnnotations: vi.fn(),
    getTextContent: vi.fn(),
  } as any
}

export function createMockPDFDocument(numPages = 10): PDFDocumentProxy {
  return {
    numPages,
    getPage: vi.fn((pageNum: number) => Promise.resolve(createMockPDFPage(pageNum))),
    destroy: vi.fn(),
    getData: vi.fn(),
    getDownloadInfo: vi.fn(),
    getMetadata: vi.fn(),
  } as any
}
