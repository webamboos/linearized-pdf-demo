import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PdfRangeTransport } from './pdf-range-transport'

describe('PdfRangeTransport', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('constructs with correct length and URL', () => {
    const transport = new PdfRangeTransport(1000, 'http://example.com/test.pdf')
    expect(transport).toBeInstanceOf(PdfRangeTransport)
  })

  it('requestDataRange makes fetch with correct Range header', async () => {
    const mockData = new Uint8Array([1, 2, 3, 4, 5])
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(mockData.buffer),
      } as Response),
    )

    const transport = new PdfRangeTransport(1000, 'http://example.com/test.pdf')
    const onDataRangeSpy = vi.spyOn(transport, 'onDataRange')

    transport.requestDataRange(0, 100)

    // Wait for async operation
    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://example.com/test.pdf', {
        headers: { Range: 'bytes=0-99' },
      })
    })
  })

  it('calls onDataRange with correct data on success', async () => {
    const mockData = new Uint8Array([1, 2, 3, 4, 5])
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(mockData.buffer),
      } as Response),
    )

    const transport = new PdfRangeTransport(1000, 'http://example.com/test.pdf')
    const onDataRangeSpy = vi.spyOn(transport, 'onDataRange')

    transport.requestDataRange(100, 200)

    await vi.waitFor(() => {
      expect(onDataRangeSpy).toHaveBeenCalledWith(100, expect.any(Uint8Array))
    })
  })

  it('handles HTTP errors gracefully', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response),
    )

    const transport = new PdfRangeTransport(1000, 'http://example.com/test.pdf')
    const onDataRangeSpy = vi.spyOn(transport, 'onDataRange')

    transport.requestDataRange(0, 100)

    await vi.waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Range request failed:', expect.any(Error))
      expect(onDataRangeSpy).not.toHaveBeenCalled()
    })
  })

  it('logs range requests to console', () => {
    const transport = new PdfRangeTransport(1000, 'http://example.com/test.pdf')

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      } as Response),
    )

    transport.requestDataRange(0, 100)

    expect(console.log).toHaveBeenCalledWith('Range request: bytes=0-99')
  })

  it('converts response to Uint8Array correctly', async () => {
    const mockData = new Uint8Array([10, 20, 30, 40, 50])
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 206,
        arrayBuffer: () => Promise.resolve(mockData.buffer),
      } as Response),
    )

    const transport = new PdfRangeTransport(1000, 'http://example.com/test.pdf')
    const onDataRangeSpy = vi.spyOn(transport, 'onDataRange')

    transport.requestDataRange(0, 50)

    await vi.waitFor(() => {
      const callArgs = onDataRangeSpy.mock.calls[0]!
      expect(callArgs[0]).toBe(0)
      const data = callArgs[1] as Uint8Array
      expect(data).toBeInstanceOf(Uint8Array)
      expect(Array.from(data)).toEqual([10, 20, 30, 40, 50])
    })
  })
})
