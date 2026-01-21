import { vi } from 'vitest'

// Mock PDF.js worker
globalThis.URL.createObjectURL = vi.fn(() => 'mock-worker-url')

// Mock DOMMatrix for PDF.js
class DOMMatrixMock {
  constructor() {}
}
globalThis.DOMMatrix = DOMMatrixMock as any

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

globalThis.IntersectionObserver = IntersectionObserverMock as any

// Suppress console errors in tests (optional, can be removed if you want to see them)
// console.error = vi.fn()
