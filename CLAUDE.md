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
- pnpm as package manager

## Project Structure

- `src/` - Application source code
- `src/main.ts` - Application entry point
- `src/App.vue` - Root Vue component
- `@/` path alias maps to `./src/`

## Requirements

- Node.js ^20.19.0 or >=22.12.0
