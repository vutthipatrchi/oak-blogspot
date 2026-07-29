import type { Article, ArticleSection, Category, Comment } from '@/data/articles'
import { supabase } from './supabase'

type ArticleCategory = Exclude<Category, 'Highlight'>

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

interface SupabaseCommentRow {
  id: number
  author: string | null
  avatar: string | null
  display_date: string | null
  created_at: string | null
  text: string | null
}

interface SupabaseArticleRow {
  id: number
  category: string | null
  tags: string[] | null
  title: string | null
  status: 'draft' | 'published' | null
  excerpt: string | null
  image_url: string | null
  author: string | null
  author_avatar: string | null
  author_bio: string[] | null
  display_date: string | null
  published_at: string | null
  likes: number | null
  sections: unknown
  source: unknown
  comments: SupabaseCommentRow[] | null
}

const articleCategories: ArticleCategory[] = ['Thinker', 'Writer', 'Literature']

function toCategory(value: string | null): ArticleCategory {
  return articleCategories.includes(value as ArticleCategory)
    ? value as ArticleCategory
    : 'Thinker'
}

function toSections(value: unknown): ArticleSection[] {
  if (!Array.isArray(value)) return []

  return value.map((section) => {
    const item = section as Partial<ArticleSection>

    return {
      title: typeof item.title === 'string' ? item.title : '',
      paragraphs: Array.isArray(item.paragraphs)
        ? item.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string')
        : [],
      bullets: Array.isArray(item.bullets)
        ? item.bullets
            .map((bullet) => {
              const entry = bullet as { term?: unknown; description?: unknown }
              return typeof entry.term === 'string' && typeof entry.description === 'string'
                ? { term: entry.term, description: entry.description }
                : null
            })
            .filter((bullet): bullet is { term: string; description: string } => Boolean(bullet))
        : undefined,
    }
  })
}

function toSource(value: unknown): Article['source'] {
  if (!value || typeof value !== 'object') return undefined

  const source = value as { label?: unknown; url?: unknown }
  return typeof source.label === 'string' && typeof source.url === 'string'
    ? { label: source.label, url: source.url }
    : undefined
}

function formatDate(value: string | null): string {
  return value ?? ''
}

function toComment(row: SupabaseCommentRow): Comment {
  return {
    id: row.id,
    author: row.author ?? 'Anonymous',
    avatar: row.avatar ?? '',
    date: row.display_date ?? formatDate(row.created_at),
    text: row.text ?? '',
  }
}

function toArticle(row: SupabaseArticleRow): Article {
  return {
    id: row.id,
    category: toCategory(row.category),
    tags: row.tags ?? [],
    title: row.title ?? '',
    status: row.status ?? (row.published_at ? 'published' : 'draft'),
    excerpt: row.excerpt ?? '',
    image: row.image_url ?? '',
    author: row.author ?? '',
    authorAvatar: row.author_avatar ?? '',
    authorBio: row.author_bio ?? [],
    date: row.display_date ?? formatDate(row.published_at),
    publishedAt: row.published_at,
    likes: row.likes ?? 0,
    sections: toSections(row.sections),
    source: toSource(row.source),
    comments: (row.comments ?? []).map(toComment),
  }
}

export async function fetchArticlesFromSupabase(): Promise<Article[]> {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      category,
      tags,
      title,
      status,
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
    `)
    .order('published_at', { ascending: false, nullsFirst: false })

  if (error) throw error

  return ((data ?? []) as SupabaseArticleRow[]).map(toArticle)
}

async function fetchArticlesFromBackend(): Promise<Article[]> {
  if (!apiBaseUrl) {
    throw new Error('Backend API is not configured.')
  }

  const response = await fetch(`${apiBaseUrl}/api/articles`)

  if (!response.ok) {
    throw new Error(`Backend API returned ${response.status}.`)
  }

  const payload = await response.json() as { articles?: Article[] }
  return payload.articles ?? []
}

export async function fetchArticles(): Promise<Article[]> {
  return apiBaseUrl
    ? fetchArticlesFromBackend()
    : fetchArticlesFromSupabase()
}

export interface ArticleWriteInput {
  category: ArticleCategory
  title: string
  excerpt: string
  image: string
  author: string
  status: 'draft' | 'published'
  sections: ArticleSection[]
}

function adminHeaders(): HeadersInit {
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY
  if (!adminApiKey) throw new Error('VITE_ADMIN_API_KEY is not configured.')

  return {
    'Content-Type': 'application/json',
    'x-admin-api-key': adminApiKey,
  }
}

async function readApiError(response: Response): Promise<Error> {
  const payload = await response.json().catch(() => null) as { error?: string } | null
  return new Error(payload?.error ?? `Backend API returned ${response.status}.`)
}

async function writeArticle(path: string, method: 'POST' | 'PATCH', input: ArticleWriteInput): Promise<Article> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: adminHeaders(),
    body: JSON.stringify(input),
  })
  if (!response.ok) throw await readApiError(response)

  const payload = await response.json() as { article: Article }
  return payload.article
}

export function createArticle(input: ArticleWriteInput): Promise<Article> {
  return writeArticle('/api/articles', 'POST', input)
}

export function updateArticle(id: number, input: ArticleWriteInput): Promise<Article> {
  return writeArticle(`/api/articles/${id}`, 'PATCH', input)
}

export async function deleteArticle(id: number): Promise<void> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')

  const response = await fetch(`${apiBaseUrl}/api/articles/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  if (!response.ok) throw await readApiError(response)
}
