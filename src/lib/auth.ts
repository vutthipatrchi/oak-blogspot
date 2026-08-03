import axios from 'axios'
import type { MemberProfile } from '@/data/member'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const storageKey = 'hh.auth'

export interface AuthSession {
  accessToken: string
  expiresAt: number | null
  role: 'member' | 'admin'
}

export interface StoredAuth {
  member: MemberProfile
  session: AuthSession
}

function apiUrl(path: string) {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')
  return `${apiBaseUrl}${path}`
}

export function toApiError(error: unknown): Error {
  if (axios.isAxiosError<{ error?: string }>(error) && error.response) {
    return new Error(error.response.data?.error ?? `Backend API returned ${error.response.status}.`)
  }
  return error instanceof Error ? error : new Error('Backend API request failed.')
}

export function loadAuth(): StoredAuth | null {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return null
    const auth = JSON.parse(raw) as StoredAuth
    if (!auth.session?.accessToken || !auth.member) return null
    if (auth.session.expiresAt && auth.session.expiresAt * 1000 <= Date.now()) {
      window.localStorage.removeItem(storageKey)
      return null
    }
    return auth
  } catch {
    return null
  }
}

export function saveAuth(auth: StoredAuth) {
  window.localStorage.setItem(storageKey, JSON.stringify(auth))
}

export function clearAuth() {
  window.localStorage.removeItem(storageKey)
}

export function authorizationHeaders(): Record<string, string> {
  const token = loadAuth()?.session.accessToken
  if (!token) throw new Error('Please log in to continue.')
  return { Authorization: `Bearer ${token}` }
}

async function authRequest<T>(path: string, data?: unknown, method: 'GET' | 'POST' | 'PATCH' = 'POST') {
  try {
    const response = await axios.request<T>({
      url: apiUrl(path),
      method,
      data,
      headers: path === '/api/auth/signup' || path === '/api/auth/login'
        ? undefined
        : authorizationHeaders(),
    })
    return response.data
  } catch (error) {
    throw toApiError(error)
  }
}

export function signUpMember(input: { name: string; username: string; email: string; password: string }) {
  return authRequest<StoredAuth>('/api/auth/signup', input)
}

export function signInMember(identifier: string, password: string, audience: 'member' | 'admin') {
  return authRequest<StoredAuth>('/api/auth/login', { identifier, password, audience })
}

export async function getCurrentMember(): Promise<MemberProfile> {
  const response = await authRequest<{ member: MemberProfile }>('/api/auth/me', undefined, 'GET')
  return response.member
}

export async function updateMemberProfile(member: MemberProfile): Promise<MemberProfile> {
  const response = await authRequest<{ member: MemberProfile }>('/api/auth/profile', member, 'PATCH')
  return response.member
}

export function updateMemberPassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return authRequest('/api/auth/password', { currentPassword, newPassword })
}
