# oak-blogspot

React + TypeScript + Vite frontend for the hh. article platform. The API and
Supabase schema live in the sibling `server-oak-blogspot` repository.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Set `VITE_API_BASE_URL` to the backend origin, for example
   `http://localhost:4000`.
4. Start the app with `npm run dev`.

Authentication uses access tokens returned by the backend. No Supabase service
key or admin API key belongs in the frontend environment.

## Scripts

- `npm run dev` starts Vite.
- `npm run lint` checks the frontend source.
- `npm run build` type-checks and builds production assets.
- `/health-test` opens the frontend-to-backend diagnostic page.

## Features

- Public published-article browsing and search
- Member signup, login, profile, and password management
- Authenticated comments and likes
- Admin article list, create, edit, publish, draft, and delete workflows
- Thai and English UI
