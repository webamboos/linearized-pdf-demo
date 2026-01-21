import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isPdfLinearized } from './check-linearized'

describe('check-linearized', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true when PDF contains /Linearized key', async () => {
    const mockPdfContent = `%PDF-1.5
1 0 obj
<<
/Linearized 1
/L 12345
>>
endobj`

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(new TextEncoder().encode(mockPdfContent).buffer),
      } as Response),
    )

    const result = await isPdfLinearized('http://example.com/test.pdf')
    expect(result).toBe(true)
    expect(fetch).toHaveBeenCalledWith('http://example.com/test.pdf', {
      headers: { Range: 'bytes=0-1023' },
    })
  })

  it('returns false when PDF does not contain /Linearized key', async () => {
    const mockPdfContent = `%PDF-1.5
1 0 obj
<<
/Type /Catalog
>>
endobj`

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(new TextEncoder().encode(mockPdfContent).buffer),
      } as Response),
    )

    const result = await isPdfLinearized('http://example.com/test.pdf')
    expect(result).toBe(false)
  })

  it('returns false when fetch fails with network error', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

    const result = await isPdfLinearized('http://example.com/test.pdf')
    expect(result).toBe(false)
  })

  it('returns false when server returns non-206 status', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response),
    )

    const result = await isPdfLinearized('http://example.com/test.pdf')
    expect(result).toBe(false)
  })

  it('handles 200 OK response (when server does not support range requests)', async () => {
    const mockPdfContent = `%PDF-1.5
1 0 obj
<<
/Linearized 1
>>
endobj`

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        arrayBuffer: () => Promise.resolve(new TextEncoder().encode(mockPdfContent).buffer),
      } as Response),
    )

    const result = await isPdfLinearized('http://example.com/test.pdf')
    expect(result).toBe(true)
  })

  it('only fetches first 1KB of data', async () => {
    const mockPdfContent = '%PDF-1.5\n/Linearized 1'

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(new TextEncoder().encode(mockPdfContent).buffer),
      } as Response),
    )

    await isPdfLinearized('http://example.com/test.pdf')

    expect(fetch).toHaveBeenCalledWith('http://example.com/test.pdf', {
      headers: { Range: 'bytes=0-1023' },
    })
  })
})
