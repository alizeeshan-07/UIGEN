# UIGen

UIGen is an AI-powered React component generator. Describe what you want to build in plain English and Claude generates production-ready React components with live preview — no setup, no config, no boilerplate.

## How it works

UIGen runs a virtual file system entirely in memory. When you send a message, Claude writes JSX/TSX files using tool calls, and the preview iframe re-renders instantly via a browser-native ES module import map — no bundler, no build step.

## Features

- **AI code generation** — Claude writes and edits your React files in real time
- **Live preview** — Changes appear instantly in a sandboxed iframe
- **Virtual file system** — No files are written to disk; everything lives in memory
- **Code editor** — Monaco-powered editor with syntax highlighting for all generated files
- **Project persistence** — Sign up to save and continue your projects across sessions
- **Works without an API key** — A mock provider returns demo components so you can explore the UI immediately

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4, Radix UI |
| AI | Anthropic Claude via Vercel AI SDK |
| Editor | Monaco Editor |
| Database | Prisma + SQLite |
| Auth | JWT (jose) + HTTP-only cookies |
| Testing | Vitest + React Testing Library |

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/alizeeshan-07/UIGEN.git
cd UIGEN
npm run setup
```

`npm run setup` installs dependencies, generates the Prisma client, and runs database migrations.

1. (Optional) Add your Anthropic API key to a `.env` file:

```env
ANTHROPIC_API_KEY=your-api-key-here
```

Without a key, UIGen uses a mock provider that returns static demo components.

1. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Sign up or continue as an anonymous user
2. Describe the component you want — e.g. *"Create a pricing card with three tiers"*
3. Watch the component appear in the live preview as Claude writes the code
4. Switch to **Code** view to browse and edit the generated files
5. Keep iterating in the chat to refine your design

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm test` | Run all tests |
| `npm run db:reset` | Reset the database |
