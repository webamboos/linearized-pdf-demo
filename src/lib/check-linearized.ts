/**
 * Checks if a PDF is linearized (optimized for fast web view) by fetching
 * the first chunk of the file and looking for the linearization dictionary.
 *
 * @param url - The URL of the PDF file
 * @returns Promise<boolean> - true if the PDF is linearized, false otherwise
 */
export async function isPdfLinearized(url: string): Promise<boolean> {
  try {
    // Fetch the first 1KB of the PDF file
    // The linearization dictionary should appear within the first 1024 bytes
    const response = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
    })

    if (!response.ok && response.status !== 206) {
      throw new Error(`HTTP ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    const text = new TextDecoder('latin1').decode(buffer)

    // Look for the /Linearized key in the PDF header
    // A linearized PDF contains a linearization dictionary that includes this key
    return text.includes('/Linearized')
  } catch (error) {
    console.error('Error checking if PDF is linearized:', error)
    // If we can't determine, assume it's not linearized (safer fallback)
    return false
  }
}
