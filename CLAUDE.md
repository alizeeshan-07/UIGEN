# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Style

- Only comment complex or non-obvious code. Avoid descriptive comments that restate what the code does.

## Commands

```bash
# Initial setup (install deps + generate Prisma client + run migrations)
npm run setup

# Development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Lint
npm lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Reset database
npm run db:reset
```

## Environment

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. Without it, a `MockLanguageModel` in [src/lib/provider.ts](src/lib/provider.ts) is used that returns static demo components — the app is fully functional without a key.

## Architecture

**UIGen** is an AI-powered React component generator. Users describe components in a chat UI and Claude generates JSX/TSX files into a virtual file system that is immediately previewed in an iframe.

### Request Flow

1. User sends a chat message → `ChatContext` (`src/lib/contexts/chat-context.tsx`) calls `POST /api/chat`
2. [src/app/api/chat/route.ts](src/app/api/chat/route.ts) reconstructs a `VirtualFileSystem` from the serialized `files` payload, then calls `streamText` via Vercel AI SDK with two tools:
   - `str_replace_editor` — creates/edits files (`buildStrReplaceTool` in `src/lib/tools/str-replace.ts`)
   - `file_manager` — renames/deletes files (`buildFileManagerTool` in `src/lib/tools/file-manager.ts`)
3. Streamed tool calls are forwarded to the client. `ChatContext` processes them via `FileSystemContext.handleToolCall`, which mutates the in-memory `VirtualFileSystem`.
4. [src/components/preview/PreviewFrame.tsx](src/components/preview/PreviewFrame.tsx) watches `refreshTrigger` from `FileSystemContext` and re-renders via `createImportMap` + `createPreviewHTML` (in `src/lib/transform/jsx-transformer.ts`). Files are compiled with `@babel/standalone` in-browser and served as blob URLs via an import map injected into a sandboxed iframe.

### Virtual File System

`VirtualFileSystem` ([src/lib/file-system.ts](src/lib/file-system.ts)) is an in-memory tree of `FileNode` objects. It never writes to disk. It is:
- Serialized to `Record<string, FileNode>` for API payloads and database storage
- Shared across the app via `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`)

For authenticated users, the serialized file system and full message history are persisted to the `Project` model in SQLite via Prisma after each AI response.

### Preview System

`createImportMap` in [src/lib/transform/jsx-transformer.ts](src/lib/transform/jsx-transformer.ts) does a two-pass compilation:
1. Transforms all `.js/.jsx/.ts/.tsx` files via Babel, creates blob URLs for each
2. Builds an ES module import map mapping local paths (including `@/` alias) and third-party packages (via `https://esm.sh`) to those blob URLs
3. Injects the map into an HTML document with Tailwind CDN, an `ErrorBoundary`, and a dynamic `import()` of the entry point (`/App.jsx`)

### Auth

JWT-based, cookie-only auth in [src/lib/auth.ts](src/lib/auth.ts) using `jose`. Sessions last 7 days. Anonymous users can use the app without an account; projects are only persisted if the user is signed in when the AI finishes responding.

### AI Prompting

The system prompt is in [src/lib/prompts/generation.tsx](src/lib/prompts/generation.tsx). Key constraints it enforces on the model:
- Every project must have `/App.jsx` as root entry point
- Use Tailwind CSS for all styling (no hardcoded styles)
- Local imports must use the `@/` alias (maps to VFS root `/`)

### Data Model (Prisma / SQLite)

See [prisma/schema.prisma](prisma/schema.prisma) for the full schema. `messages` stores the full AI SDK message array; `data` stores the serialized `VirtualFileSystem`. The Prisma client is generated to `src/generated/prisma`.

### Key Directories

- `src/app/` — Next.js App Router pages and API routes
- `src/components/chat/` — Chat UI (ChatInterface, MessageList, MessageInput, MarkdownRenderer)
- `src/components/editor/` — FileTree and Monaco-based CodeEditor
- `src/components/preview/` — PreviewFrame (iframe renderer)
- `src/lib/contexts/` — FileSystemContext and ChatContext (client state)
- `src/lib/tools/` — AI tool implementations (str-replace, file-manager)
- `src/lib/transform/` — Babel transform + import map + HTML generation for preview
- `src/lib/` — auth, file-system, prisma client, provider (LLM selection)

### Testing

Tests use Vitest + jsdom + React Testing Library. Test files are colocated in `__tests__/` folders next to the source they test.
