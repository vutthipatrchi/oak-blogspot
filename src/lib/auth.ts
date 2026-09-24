import axios from 'axios'
import type { MemberProfile } from '@/data/member'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
let activeAuth: StoredAuth | null = null

export interface AuthSession {
  accessToken: string
  expiresAt: number | null
  role: UserRole
}

export type UserRole = 'owner' | 'admin' | 'member'

export class ApiError extends Error {
  statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

export function canManageArticles(role: UserRole | undefined): boolean {
  return role === 'owner' || role === 'admin'
}

export interface StoredAuth {
  member: MemberProfile
  session: AuthSession
}

export interface SignUpResult {
  member: MemberProfile
  session: AuthSession | null
  requiresEmailConfirmation?: boolean
}

function apiUrl(path: string) {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured.')
  return `${apiBaseUrl}${path}`
}

export function toApiError(error: unknown): Error {
  if (axios.isAxiosError<{ error?: string }>(error) && error.response) {
    return new ApiError(error.response.data?.error ?? `Backend API returned ${error.response.status}.`, error.response.status)
  }
  return error instanceof Error ? error : new Error('Backend API request failed.')
}

export function loadAuth(): StoredAuth | null {
  return activeAuth
}

export function saveAuth(auth: StoredAuth) {
  activeAuth = auth
}

export function clearAuth() {
  activeAuth = null
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
      withCredentials: true,
      headers: ['/api/auth/signup', '/api/auth/login', '/api/auth/refresh', '/api/auth/recover', '/api/auth/recover/complete'].includes(path)
        ? undefined
        : authorizationHeaders(),
    })
    return response.data
  } catch (error) {
    throw toApiError(error)
  }
}

export function signUpMember(input: { name: string; username: string; email: string; password: string }) {
  return authRequest<SignUpResult>('/api/auth/signup', input)
}

export function signInMember(identifier: string, password: string, audience: 'member' | 'admin') {
  return authRequest<StoredAuth>('/api/auth/login', { identifier, password, audience })
}

export function requestPasswordRecovery(email: string): Promise<{ message: string }> {
  return authRequest('/api/auth/recover', { email })
}

export function completePasswordRecovery(refreshToken: string, newPassword: string): Promise<{ message: string }> {
  return authRequest('/api/auth/recover/complete', { refreshToken, newPassword })
}

export function refreshAuth(): Promise<StoredAuth> {
  return authRequest<StoredAuth>('/api/auth/refresh')
}

export async function revokeAuth(accessToken: string): Promise<void> {
  try {
    await axios.post(apiUrl('/api/auth/logout'), undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    })
  } catch (error) {
    throw toApiError(error)
  }
}

export async function getCurrentMember(): Promise<MemberProfile> {
  const response = await authRequest<{ member: MemberProfile }>('/api/auth/me', undefined, 'GET')
  return response.member
}

export async function updateMemberProfile(member: MemberProfile): Promise<MemberProfile> {
  const response = await authRequest<{ member: MemberProfile }>('/api/auth/profile', {
    ...member,
    avatar: member.avatarPath ?? member.avatar,
  }, 'PATCH')
  return response.member
}

export async function uploadMemberProfileImage(file: File): Promise<{ path: string; url: string }> {
  try {
    const response = await axios.post<{ path: string; url: string }>(
      apiUrl('/api/uploads/profiles/members'),
      file,
      {
        headers: { 'Content-Type': file.type, ...authorizationHeaders() },
        withCredentials: true,
      },
    )
    return response.data
  } catch (error) {
    throw toApiError(error)
  }
}

export function updateMemberPassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return authRequest('/api/auth/password', { currentPassword, newPassword })
}
