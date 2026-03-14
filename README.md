# Drive MVP

Production-style MVP for file storage and sharing, built in phases and finalized as a Docker-first local stack.

## Overview

The project delivers a simplified Google Drive style product with:
- registration and login
- nested folders
- direct uploads with presigned URLs
- file rename, move, delete, and preview/download
- sharing by email with `viewer` and `editor` roles
- authenticated public files
- realtime `files:updated` notifications

The implementation uses:
- `apps/api`: NestJS + TypeORM + PostgreSQL + S3/MinIO + JWT + Socket.IO
- `apps/web`: Next.js + Tailwind + TanStack Query + Socket.IO client

## Quick Start

### Recommended: Docker

The default Docker flow runs the whole system with one command and uses MinIO as local S3-compatible storage.

```bash
docker compose up --build
```

Available services:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)
- Health endpoint: [http://localhost:3001/health](http://localhost:3001/health)
- MinIO API: [http://localhost:9000](http://localhost:9000)
- MinIO Console: [http://localhost:9001](http://localhost:9001)

### Local development without Docker

Backend:

```bash
npm run dev:api
```

Frontend:

```bash
npm run dev:web
```

## Repository Structure

```text
apps/
  api/
    src/
      auth/
      config/
      files/
      folders/
      health/
      realtime/
      users/
  web/
    src/
      api/
      app/
      components/
      providers/
      shared/
```

Frontend structure:
- `src/api/*`: request clients, models, and TanStack Query hooks
- `src/components/*`: render components only
- `src/shared/*`: constants, reusable hooks, and feature utilities
- `src/providers/*`: React Query and realtime providers

## Environment Files

Root:
- `.env`
- `.env.example`

Backend:
- `apps/api/.env`
- `apps/api/.env.example`
- `apps/api/.env.docker`
- `apps/api/.env.docker.example`

Frontend:
- `apps/web/.env.local`
- `apps/web/.env.example`
- `apps/web/.env.docker`
- `apps/web/.env.docker.example`

### Important backend variables

- `PORT`
- `FRONTEND_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNC`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_ENDPOINT`
- `AWS_S3_PUBLIC_ENDPOINT`
- `AWS_S3_FORCE_PATH_STYLE`
- `S3_PRESIGNED_URL_EXPIRES_IN`

### Important frontend variables

- `NEXT_PUBLIC_API_BASE_URL`

## Storage Modes

### Local Docker mode

By default, Docker uses MinIO through `apps/api/.env.docker`.

That means:
- uploads work locally without AWS credentials
- objects are stored in a local S3-compatible bucket
- the backend still uses the same presigned URL flow as production

### Real AWS S3 mode

To switch Docker to real AWS S3:
- update `apps/api/.env.docker`
- keep `DB_HOST=database`
- set real AWS credentials and bucket values
- clear `AWS_S3_ENDPOINT`
- clear `AWS_S3_PUBLIC_ENDPOINT`
- set `AWS_S3_FORCE_PATH_STYLE=false`

The backend verifies that the uploaded object exists in storage before writing file metadata to PostgreSQL.

## Architecture

### Backend

CRUD operations are handled through REST:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /folders`
- `GET /folders`
- `PATCH /folders/:id`
- `DELETE /folders/:id`
- `GET /files`
- `POST /files/upload-url`
- `POST /files`
- `PATCH /files/:id`
- `DELETE /files/:id`
- `GET /files/:id/download-url`
- `POST /files/:id/share`

Realtime uses Socket.IO:
- event: `files:updated`

The socket layer only notifies clients that data changed. The frontend always refetches through REST after receiving the event.

### Frontend

The frontend uses:
- TanStack Query for data fetching and invalidation
- a feature-based API layer for `auth`, `folders`, `files`, `sharing`, and `socket`
- shared feature hooks and utilities under `src/shared`
- modal-based file preview and confirmation flows inside the app

## Permissions Model

Roles:
- `owner`
- `editor`
- `viewer`

Rules:
- `owner`: full control
- `editor`: rename file metadata
- `viewer`: preview/download only

Visibility:
- `private`
- `public`

`public` means every authenticated user in the app can see and preview the file.

## Realtime Model

The backend places each authenticated socket connection into:
- a user-specific room: `user:{userId}`
- an authenticated-users room for public file visibility changes

Events are emitted after:
- folder create, rename, delete
- file create, rename, move, visibility change, delete
- file share changes

The frontend listens for `files:updated` and invalidates:
- folder queries
- file queries

## Manual Test Flow

1. Register user A.
2. Register user B.
3. Log in as user A.
4. Create a folder.
5. Upload a file.
6. Preview the file in the in-app modal.
7. Rename or move the file.
8. Share it with user B as `viewer`.
9. Log in as user B and confirm the file appears in `Incoming Files`.
10. Change the role to `editor` and confirm rename works for user B.
11. Mark a file public and confirm another authenticated user sees it.
12. Open two browser sessions and verify changes sync without manual refresh.

## Phase Summary

1. Project setup and base architecture
2. Authentication
3. Folder system
4. S3 upload flow
5. File management
6. Sharing and permissions
7. Realtime updates with WebSockets
8. UI polish and README

## Assumptions

- Public files are visible to authenticated users only.
- Shared files are sent to already-registered users by email lookup.
- WebSockets are notification-only; they do not stream file tree payloads.
- TypeORM `synchronize` stays enabled for MVP development speed.
- Browser-native iframe preview is sufficient for this submission.

## Known Limitations

- No collaborative editing
- No file version history
- No comments or activity feed
- No advanced search or preview generation pipeline
- No anonymous public links
- No pagination for large workspaces
- No antivirus scanning or background processing

## Validation

Run all checks:

```bash
npm run lint
npm run build
```

## Notes

- Docker is the recommended way to run the MVP end to end.
- The UI is intentionally Neo-Brutalist: thick borders, hard shadows, high-contrast blocks, and bold typography.
- The project was implemented phase by phase so it can be resumed from any completed phase without rebuilding prior work.
