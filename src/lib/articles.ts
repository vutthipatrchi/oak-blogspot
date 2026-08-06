import axios from 'axios'
import type { Article, ArticleCategory, ArticleSection, Comment } from '@/data/articles'
import { authorizationHeaders, toApiError } from './auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export const hasBackendApi = Boolean(apiBaseUrl)

export interface ArticlePage {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export interface ArticlePageFilters {
  page: number
  limit: number
  status?: 'draft' | 'published'
  category?: string
  search?: string
}

export async function fetchArticlePage(filters: ArticlePageFilters): Promise<ArticlePage> {
  if (!apiBaseUrl) throw new Error('Backend API is not configured.')

  try {
    const response = await axios.get<Partial<ArticlePage> & { articles?: Article[] }>(`${apiBaseUrl}/api/articles`, {
      params: filters,
    })
    const allArticles = response.data.articles ?? []
    if (response.data.pagination) {
      return { articles: allArticles, pagination: response.data.pagination }
    }

    // Compatibility with API deployments that do not support pagination yet.
    const query = filters.search?.trim().toLowerCase()
    const matchingArticles = allArticles.filter((article) => {
      if (filters.status && article.status !== filters.status) return false
      if (filters.category && article.category !== filters.category) return false
      if (!query) return true
      return [article.title, article.excerpt, article.author, ...article.tags]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
    const from = (filters.page - 1) * filters.limit
    const articles = matchingArticles.slice(from, from + filters.limit)
    return {
      articles,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: matchingArticles.length,
        hasMore: from + articles.length < matchingArticles.length,
      },
    }
  } catch (error) {
    throw toApiError(error)
  }
}

export async function fetchCategories(): Promise<ArticleCategory[]> {
  if (!apiBaseUrl) throw new Error('Backend API is not configured.')

  try {
    const response = await axios.get<{ categories?: ArticleCategory[] }>(`${apiBaseUrl}/api/categories`)
    return response.data.categories ?? []
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createCategory(name: string): Promise<ArticleCategory> {
  if (!apiBaseUrl) throw new Error('Backend API is not configured.')

  try {
    const response = await axios.post<{ category: ArticleCategory }>(
      `${apiBaseUrl}/api/categories`,
      { name },
      { headers: { 'Content-Type': 'application/json', ...authorizationHeaders() } },
    )
    return response.data.category
  } catch (error) {
    throw toApiError(error)
  }
}

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
  categoryId: number
  tags: string[]
  title: string
  excerpt: string
  image: string
  status: 'draft' | 'published'
  sections: ArticleSection[]
}

export interface UploadedImage {
  path: string
  url: string
}

export async function uploadArticleImage(file: File): Promise<UploadedImage> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')

  try {
    const response = await axios.post<UploadedImage>(
      `${apiBaseUrl}/api/uploads/articles`,
      file,
      {
        headers: {
          'Content-Type': file.type,
          ...authorizationHeaders(),
        },
      },
    )
    return response.data
  } catch (error) {
    throw toApiError(error)
  }
}

async function writeArticle(path: string, method: 'POST' | 'PATCH', input: ArticleWriteInput): Promise<Article> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')

  try {
    const response = await axios.request<{ article: Article }>({
      url: `${apiBaseUrl}${path}`,
      method,
      headers: { 'Content-Type': 'application/json', ...authorizationHeaders() },
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
      headers: authorizationHeaders(),
    })
  } catch (error) {
    throw toApiError(error)
  }
}

export async function createArticleComment(articleId: number, text: string): Promise<Comment> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')
  try {
    const response = await axios.post<{ comment: Comment }>(
      `${apiBaseUrl}/api/articles/${articleId}/comments`,
      { text },
      { headers: authorizationHeaders() },
    )
    return response.data.comment
  } catch (error) {
    throw toApiError(error)
  }
}

export async function deleteArticleComment(articleId: number, commentId: number): Promise<void> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')
  try {
    await axios.delete(`${apiBaseUrl}/api/articles/${articleId}/comments/${commentId}`, {
      headers: authorizationHeaders(),
    })
  } catch (error) {
    throw toApiError(error)
  }
}

export async function toggleArticleLike(articleId: number): Promise<{ liked: boolean; likes: number }> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')
  try {
    const response = await axios.post<{ liked: boolean; likes: number }>(
      `${apiBaseUrl}/api/articles/${articleId}/like`,
      undefined,
      { headers: authorizationHeaders() },
    )
    return response.data
  } catch (error) {
    throw toApiError(error)
  }
}
