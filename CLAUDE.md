# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server with HMR
pnpm build            # Type-check and build for production
pnpm build-only       # Build without type-checking
pnpm type-check       # Run TypeScript type checking (vue-tsc)
pnpm format           # Format code with Prettier
pnpm preview          # Preview production build locally
```

## Tech Stack

- Vue 3 with Composition API (`<script setup>`)
- Vite (beta) as build tool
- TypeScript with vue-tsc for type checking
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- pdfjs-dist for PDF rendering
- pnpm as package manager
- Google Sans font (loaded via index.html)

## Project Structure

- `src/` - Application source code
- `src/main.ts` - Application entry point
- `src/app.vue` - Root Vue component
- `src/assets/main.css` - Global styles with Tailwind imports
- `src/components/` - Vue components
  - `pdf-viewer.vue` - PDF viewer component with lazy loading
- `@/` path alias maps to `./src/`

## PDF Viewer Component

The `pdf-viewer.vue` component implements efficient PDF loading:

- **Props**: `url` (PDF URL), `pageCount` (number of pages)
- **Range requests**: Uses custom `PDFDataRangeTransport` to fetch only needed byte ranges
- **Lazy loading**: IntersectionObserver renders pages only when near viewport (1000px buffer)
- **Skeleton placeholders**: Shows animated skeleton while pages load

## Requirements

- Node.js ^20.19.0 or >=22.12.0
