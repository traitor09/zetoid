# Project Overview

**Name:** Zetoid
**Description:** A full-stack AI-powered todo app. Natural-language task capture, smart prioritization, and conversational reminders. Built with Next.js, TypeScript, and Vercel AI SDK. No boilerplate—just a clean data layer, an AI pipeline, and a responsive UI.

# Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Runtime | Node.js | ES2022 modules |
| Framework | Next.js 15 | App Router, server actions |
| Language | TypeScript | Strict mode |
| UI | React 19 + Tailwind CSS | Server Components by default |
| AI | Vercel AI SDK | `ai` + `@ai-sdk/google` |
| LLM | Gemini 3.8 Flash | `google('gemini-3.8-flash')` |
| Database | SQLite (via Prisma) | Zero-config local dev |
| Linting/Formatting | Biome | Code style enforcement |
| Dev Tool | Antigravity | AI-assisted development |

# Project Structure

src/
├── app/
│ ├── layout.tsx # Root layout (providers, fonts)
│ ├── page.tsx # Dashboard (task list)
│ ├── new/
│ │ └── page.tsx # Quick-add with NLP parsing
│ └── api/
│ ├── tasks/
│ │ └── route.ts # GET/POST /api/tasks
│ └── ai/
│ ├── parse/
│ │ └── route.ts # NLP → structured task
│ └── summarize/
│ └── route.ts # Daily digest
├── components/
│ ├── TaskList.tsx # Main list (server component)
│ ├── TaskItem.tsx # Single row (client, optimistic)
│ ├── AddTask.tsx # Input with AI suggestion
│ └── ui/ # Primitives (Button, Input, Badge)
├── lib/
│ ├── db.ts # Prisma client singleton
│ ├── ai/
│ │ ├── provider.ts # google('gemini-3.8-flash') singleton
│ │ ├── parseTask.ts # NLP → { title, due, priority, tags }
│ │ └── summarize.ts # Conversation → daily digest
│ └── utils.ts # cn(), date helpers
├── types/
│ └── task.ts # Task, ParsedTask, TaskStatus
└── server/
└── actions.ts # Server actions (create, toggle, delete)

prisma/
├── schema.prisma # Task model
└── migrations/


# Conventions

### Code Style
- ES modules only (`"type": "module"`)
- TypeScript strict mode
- Biome for linting and formatting
- Server Components by default; `"use client"` only when needed (state, events)

### File Naming
- PascalCase for React components: `TaskItem.tsx`
- camelCase for utilities and lib files: `parseTask.ts`
- kebab-case for route directories: `new/`, `api/tasks/`

### TypeScript
- Target: ES2021
- Module: ES2022
- Strict type checking enabled
- Zod for all external input validation (API routes, AI output)

### Running the App

**Development:**
```bash
npm run dev          # Next.js dev server on :3000
npm run db:migrate   # Apply Prisma migrations
npm run db:seed      # Seed sample tasks

Production:

npm run build
npm start

Architecture
Core Data Flow
1. User types natural language ("call mom friday 5pm")
2. POST /api/ai/parse → generateObject with Zod schema (gemini-3.8-flash)
3. Returns { title, dueDate, priority, tags }
4. Server action createTask() persists via Prisma
5. UI revalidates (router.refresh) → TaskList re-renders

AI Provider
Package: @ai-sdk/google
Model: google('gemini-3.8-flash') — single model, no fallback
Singleton in lib/ai/provider.ts, imported everywhere
Auth: reads GOOGLE_GENERATIVE_AI_API_KEY from env automatically
AI Pipeline
Parse: generateObject with a Zod schema — no free-text parsing
Summarize: streamText for daily digest, streamed to client
Guardrail: AI output is always validated by Zod before hitting the DB
Fallback: If AI parse fails, show raw text as title, let user edit
State Management
Server state: Prisma (SQLite) — single source of truth
Client state: React useState for optimistic toggles only
No Redux, no Zustand — server actions + revalidatePath cover it
Task Model
model Task {
  id        String   @id @default(cuid())
  title     String
  dueDate   DateTime?
  priority  Int      @default(3)   // 1=high, 3=medium, 5=low
  tags      String[]
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

Key Concepts
NLP Capture: Natural language in → structured task out (Zod-validated)
Server Actions: All mutations go through server/actions.ts — no client-side API calls
Optimistic UI: Toggle/delete updates UI instantly, reverts on server error
AI as a Feature, Not a Framework: AI handles parsing and summarization only; app logic is deterministic
Single DB, Single Source: No caching layer, no message queue — SQLite + Prisma is enough
Progressive Enhancement: App works fully without AI (manual title/date); AI is a convenience layer
Environment
Node.js 18+
GOOGLE_GENERATIVE_AI_API_KEY in .env.local (get key from Google AI Studio)
Local SQLite (auto-created by Prisma)
Antigravity for AI-assisted development (reads this file as context)
