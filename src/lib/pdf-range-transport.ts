import { PDFDataRangeTransport } from 'pdfjs-dist'

export class PdfRangeTransport extends PDFDataRangeTransport {
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
