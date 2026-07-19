# video-meeting-app

English | [日本語](./README.ja.md)

<!-- Keep this file in sync when README.ja.md is updated. -->

## Overview

A browser-based video meeting application. The goal is to let multiple people start a video call just by sharing a URL, with no app installation required.

### Key Features (planned)

- Room-based video calls
- Screen sharing
- Text chat

## Tech Stack

| Category | Technology | Version |
| --- | --- | --- |
| Language | TypeScript | 5.x |
| Frontend | Next.js (App Router) | 16.x |
| Backend | NestJS | 11.x |
| Real-time | WebRTC (P2P mesh) / Socket.IO (signaling) | - |
| Database | TBD | - |
| Package Manager | pnpm workspace | 11.x |
| Task Runner | Turborepo | 2.x |
| CI/CD | GitHub Actions | - |

<!-- Sync versions with the actual values after scaffolding -->

## Architecture (Video Calls)

Video and audio are exchanged directly between browsers over WebRTC (P2P mesh). The backend only acts as a signaling server, relaying the information needed to establish connections (offer / answer / ICE candidates).

```
[Browser A] ←── video & audio (WebRTC P2P) ──→ [Browser B]
     │                                             │
     └──── signaling (Socket.IO) ────┐ ┌───────────┘
                                     │ │
                            [NestJS backend]
```

- Uses Google's public STUN server (`stun:stun.l.google.com:19302`). TURN will be considered when needed
- A P2P mesh practically supports up to 4-6 participants; migration to an SFU will be considered if larger rooms are required

## Directory Structure

```
.
├── .github/             # PR template & CI workflows
├── apps/
│   ├── frontend/        # Next.js app (port 3000)
│   │   └── src/
│   └── backend/         # NestJS API server (port 3001)
│       └── src/
├── packages/
│   └── shared/          # Types shared between frontend and backend (API / WebSocket events)
├── pnpm-workspace.yaml  # Workspace definition
├── turbo.json           # Turborepo task definitions
└── tsconfig.base.json   # Shared TypeScript config (extended by each package)
```

## Setup

Requirements: Node.js 24+ / pnpm 11+

```bash
pnpm install   # Install dependencies
pnpm dev       # Start frontend and backend together
```

## Development Commands

Run everything from the repository root.

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev servers (all apps) |
| `pnpm build` | Production build (Turborepo resolves dependency order) |
| `pnpm test` | Run tests |
| `pnpm lint` | Run linter |
| `pnpm format` | Format code |

## Dev Server URLs

| App | URL |
| --- | --- |
| frontend | http://localhost:3000 |
| backend | http://localhost:3001 |
