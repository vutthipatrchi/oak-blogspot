import axios from 'axios'
import type { Article, ArticleSection, Category } from '@/data/articles'

type ArticleCategory = Exclude<Category, 'Highlight'>

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export async function fetchArticles(): Promise<Article[]> {
  if (!apiBaseUrl) {
    throw new Error('Backend API is not configured.')
  }

  try {
    const response = await axios.get<{ articles?: Article[] }>(`${apiBaseUrl}/api/articles`)
    return response.data.articles ?? []
  } catch (error) {
    throw toApiError(error)
  }
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

function adminHeaders(): Record<string, string> {
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY
  if (!adminApiKey) throw new Error('VITE_ADMIN_API_KEY is not configured.')

  return {
    'Content-Type': 'application/json',
    'x-admin-api-key': adminApiKey,
  }
}

function toApiError(error: unknown): Error {
  if (axios.isAxiosError<{ error?: string }>(error) && error.response) {
    return new Error(error.response.data?.error ?? `Backend API returned ${error.response.status}.`)
  }

  return error instanceof Error ? error : new Error('Backend API request failed.')
}

async function writeArticle(path: string, method: 'POST' | 'PATCH', input: ArticleWriteInput): Promise<Article> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')

  try {
    const response = await axios.request<{ article: Article }>({
      url: `${apiBaseUrl}${path}`,
      method,
      headers: adminHeaders(),
      data: input,
    })
    return response.data.article
  } catch (error) {
    throw toApiError(error)
  }
}

export function createArticle(input: ArticleWriteInput): Promise<Article> {
  return writeArticle('/api/articles', 'POST', input)
}

export function updateArticle(id: number, input: ArticleWriteInput): Promise<Article> {
  return writeArticle(`/api/articles/${id}`, 'PATCH', input)
}

export async function deleteArticle(id: number): Promise<void> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')

  try {
    await axios.delete(`${apiBaseUrl}/api/articles/${id}`, {
      headers: adminHeaders(),
    })
  } catch (error) {
    throw toApiError(error)
  }
}
