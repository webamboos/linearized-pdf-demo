# Linearized PDF loader with pdf.js & Vue

This is a small demo that shows how to load PDF's incrementally via range requests. Theoretically, this behaviour is built into pdf.js but it doesn't seem to work out of the box. This implementation presents a custom PDF Transport class that does the range requests after an initial HEAD request which is used to determine the size of the PDF.

> [!warning]
> This is just a proof-of-concept that was vibe coded with Claude Code. Please don't use this code in production without reviewing it thoroughly as there are many rough edges and possible bugs (e.g. the current code does no checks if the PDF is not linearized).
> 