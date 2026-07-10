import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { canWriteWithSupabase, isSupabaseConfigured, supabase } from './supabase.js'
import { toArticle, toArticleInsert, toArticleUpdate } from './articleMapper.js'

const app = express()
const port = Number(process.env.PORT ?? 4000)
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

const articleSelect = `
  id,
  category,
  tags,
  title,
  excerpt,
  image_url,
  author,
  author_avatar,
  author_bio,
  display_date,
  published_at,
  likes,
  sections,
  source,
  comments (
    id,
    author,
    avatar,
    display_date,
    created_at,
    text
  )
`

app.use(cors({ origin: clientOrigin }))
app.use(express.json({ limit: '1mb' }))

function requireSupabase(_req, res, next) {
  if (!supabase) {
    res.status(503).json({ error: 'Supabase is not configured on the server.' })
    return
  }

  next()
}

function requireAdmin(req, res, next) {
  const adminApiKey = process.env.ADMIN_API_KEY
  const requestKey = req.get('x-admin-api-key')

  if (!adminApiKey || requestKey !== adminApiKey) {
    res.status(401).json({ error: 'Admin API key is required.' })
    return
  }

  if (!canWriteWithSupabase) {
    res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required for writes.' })
    return
  }

  next()
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    supabaseConfigured: isSupabaseConfigured,
    writesEnabled: canWriteWithSupabase,
  })
})

app.get('/api/articles', requireSupabase, async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(articleSelect)
      .order('published_at', { ascending: false, nullsFirst: false })

    if (error) throw error

    res.json({ articles: (data ?? []).map(toArticle) })
  } catch (error) {
    next(error)
  }
})

app.get('/api/articles/:id', requireSupabase, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(articleSelect)
      .eq('id', Number(req.params.id))
      .single()

    if (error) throw error

    res.json({ article: toArticle(data) })
  } catch (error) {
    next(error)
  }
})

app.post('/api/articles', requireSupabase, requireAdmin, async (req, res, next) => {
  try {
    const article = toArticleInsert(req.body)

    if (!article.title || !article.excerpt || !article.author) {
      res.status(400).json({ error: 'title, excerpt, and author are required.' })
      return
    }

    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select(articleSelect)
      .single()

    if (error) throw error

    res.status(201).json({ article: toArticle(data) })
  } catch (error) {
    next(error)
  }
})

app.patch('/api/articles/:id', requireSupabase, requireAdmin, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(toArticleUpdate(req.body))
      .eq('id', Number(req.params.id))
      .select(articleSelect)
      .single()

    if (error) throw error

    res.json({ article: toArticle(data) })
  } catch (error) {
    next(error)
  }
})

app.delete('/api/articles/:id', requireSupabase, requireAdmin, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', Number(req.params.id))

    if (error) throw error

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Unexpected server error.' })
})

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
