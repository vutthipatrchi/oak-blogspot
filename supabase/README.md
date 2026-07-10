# Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings > API.
5. If you want the frontend to use the local backend, keep `VITE_API_BASE_URL=http://localhost:4000`.
6. Fill in backend values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_API_KEY`
7. Run the API server with `npm run server`.
8. Run the Vite dev server with `npm run dev`.

The app falls back to `src/data/articles.ts` when the Supabase environment variables are missing or when the fetch fails.

Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code. It belongs in the backend environment only.

## Backend API

The Express server lives in `server/index.js`.

- `GET /api/health`
- `GET /api/articles`
- `GET /api/articles/:id`
- `POST /api/articles`
- `PATCH /api/articles/:id`
- `DELETE /api/articles/:id`

Write routes require the `x-admin-api-key` header and `SUPABASE_SERVICE_ROLE_KEY`.

## Article content format

Store article sections as JSON in the `sections` column:

```json
[
  {
    "title": "Section title",
    "paragraphs": ["First paragraph", "Second paragraph"],
    "bullets": [
      {
        "term": "Keyword",
        "description": "Short explanation"
      }
    ]
  }
]
```

The `source` column can be `null` or:

```json
{
  "label": "Original source",
  "url": "https://example.com"
}
```
