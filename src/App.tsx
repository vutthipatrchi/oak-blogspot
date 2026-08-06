import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import type { AuthMode } from './components/AuthPage'
import type { MemberView } from './components/MemberPage'
import { Footer } from './components/Footer'
import { HeroSection } from './components/HeroSection'
import { SiteHeader } from './components/SiteHeader'
import type { MemberProfile } from './data/member'
import { articles as staticArticles, type ArticleCategory } from './data/articles'
import {
  canManageArticles,
  clearAuth,
  getCurrentMember,
  loadAuth,
  refreshAuth,
  revokeAuth,
  saveAuth,
  updateMemberPassword,
  updateMemberProfile,
  type StoredAuth,
} from './lib/auth'
import { createArticle, createCategory, deleteArticle as deleteArticleRequest, fetchArticles, fetchCategories, updateArticle, type ArticleWriteInput } from './lib/articles'
import './App.css'

const ArticlePage = lazy(() => import('./components/ArticlePage'))
const ArticleSection = lazy(() => import('./components/ArticleSection'))
const ArticleManagementPage = lazy(() => import('./components/ArticleManagementPage'))
const ArticleEditorPage = lazy(() => import('./components/ArticleEditorPage'))
const AuthPage = lazy(() => import('./components/AuthPage'))
const MemberPage = lazy(() => import('./components/MemberPage'))

const pageFallback = <main className="page">Loading…</main>

type AppView =
  | { page: 'home' }
  | { page: 'article'; id: number }
  | { page: 'auth'; mode: AuthMode; audience: 'member' | 'admin' }
  | { page: 'member'; view: MemberView }
  | { page: 'admin-articles' }
  | { page: 'admin-create' }
  | { page: 'admin-edit'; id: number }

function viewFromLocation(): AppView {
  const params = new URLSearchParams(window.location.search)
  const admin = params.get('admin')
  const member = params.get('member')
  const auth = params.get('auth')
  const articleId = Number(params.get('article'))

  if (admin === 'login' || admin === 'signup') {
    return { page: 'auth', mode: admin, audience: 'admin' }
  }
  if (admin === 'articles') return { page: 'admin-articles' }
  if (admin === 'create-article') return { page: 'admin-create' }
  if (admin === 'edit-article') {
    const id = Number(params.get('id'))
    if (Number.isSafeInteger(id) && id > 0) return { page: 'admin-edit', id }
  }
  if (member === 'profile' || member === 'reset-password') {
    return { page: 'member', view: member }
  }
  if (auth === 'signup' || auth === 'login') {
    return { page: 'auth', mode: auth, audience: 'member' }
  }
  if (Number.isSafeInteger(articleId) && articleId > 0) {
    return { page: 'article', id: articleId }
  }
  return { page: 'home' }
}

function App() {
  const [articleList, setArticleList] = useState(staticArticles)
  const [articlesLoading, setArticlesLoading] = useState(
    () => Boolean(import.meta.env.VITE_API_BASE_URL),
  )
  const [articlesError, setArticlesError] = useState('')
  const [categoryList, setCategoryList] = useState<ArticleCategory[]>([])
  const [currentAuth, setCurrentAuth] = useState<StoredAuth | null>(loadAuth)
  const [authReady, setAuthReady] = useState(false)
  const [view, setView] = useState<AppView>(viewFromLocation)
  const currentMember = currentAuth?.member ?? null

  const selectedArticle = view.page === 'article'
    ? articleList.find((article) => article.id === view.id)
    : undefined
  const publishedArticles = articleList.filter((article) => article.status === 'published')

  useEffect(() => {
    if (!import.meta.env.VITE_API_BASE_URL) return

    let ignore = false
    fetchArticles()
      .then((loadedArticles) => {
        if (!ignore) {
          setArticleList(loadedArticles)
        }
      })
      .catch((error: unknown) => {
        console.warn('Unable to load articles. Falling back to static articles.', error)
        if (!ignore) setArticlesError(error instanceof Error ? error.message : 'Unable to load articles.')
      })
      .finally(() => {
        if (!ignore) setArticlesLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!import.meta.env.VITE_API_BASE_URL) return

    let ignore = false
    fetchCategories()
      .then((categories) => {
        if (!ignore) setCategoryList(categories)
      })
      .catch((error: unknown) => {
        console.warn('Unable to load categories.', error)
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    refreshAuth()
      .then((auth) => {
        if (ignore) return
        saveAuth(auth)
        setCurrentAuth(auth)
      })
      .catch(() => {
        if (ignore) return
        clearAuth()
        setCurrentAuth(null)
      })
      .finally(() => {
        if (!ignore) setAuthReady(true)
      })
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    const accessToken = currentAuth?.session.accessToken
    if (!accessToken) return
    let ignore = false
    let refreshTimer: ReturnType<typeof setTimeout> | undefined

    const expireSession = () => {
      if (ignore) return
      clearAuth()
      setCurrentAuth(null)
    }

    const refreshSession = async () => {
      try {
        const refreshed = await refreshAuth()
        if (ignore) return
        saveAuth(refreshed)
        setCurrentAuth(refreshed)
      } catch {
        expireSession()
      }
    }

    const expiresAt = currentAuth.session.expiresAt
    const refreshDelay = expiresAt ? expiresAt * 1000 - Date.now() - 60_000 : null
    if (refreshDelay !== null && refreshDelay <= 0) {
      void refreshSession()
    } else {
      getCurrentMember()
        .then((member) => {
          if (ignore) return
          setCurrentAuth((current) => {
            if (!current || current.session.accessToken !== accessToken) return current
            const verified = { ...current, member }
            saveAuth(verified)
            return verified
          })
        })
        .catch(expireSession)

      if (refreshDelay !== null) {
        refreshTimer = setTimeout(
          () => { void refreshSession() },
          Math.min(refreshDelay, 2_147_000_000),
        )
      }
    }

    return () => {
      ignore = true
      if (refreshTimer) clearTimeout(refreshTimer)
    }
  }, [currentAuth?.session.accessToken, currentAuth?.session.expiresAt])

  const navigate = useCallback((nextView: AppView, search = '') => {
    setView(nextView)
    window.history.pushState({}, '', `${window.location.pathname}${search}`)
    window.scrollTo(0, 0)
  }, [])

  const goHome = useCallback(() => navigate({ page: 'home' }), [navigate])

  const openArticle = useCallback(
    (id: number) => navigate({ page: 'article', id }, `?article=${id}`),
    [navigate],
  )

  const openAuth = useCallback(
    (mode: AuthMode) => navigate({ page: 'auth', mode, audience: 'member' }, `?auth=${mode}`),
    [navigate],
  )

  const openMemberView = useCallback((memberView: MemberView) => {
    if (!currentMember) {
      openAuth('login')
      return
    }
    navigate({ page: 'member', view: memberView }, `?member=${memberView}`)
  }, [currentMember, navigate, openAuth])

  const saveMember = useCallback(async (member: MemberProfile) => {
    const savedMember = await updateMemberProfile(member)
    setCurrentAuth((current) => {
      if (!current) return current
      const next = { ...current, member: savedMember }
      saveAuth(next)
      return next
    })
  }, [])

  const authenticateMember = useCallback((auth: StoredAuth) => {
    setCurrentAuth(auth)
    saveAuth(auth)
    navigate({ page: 'member', view: 'profile' }, '?member=profile')
  }, [navigate])

  const logoutMember = useCallback(() => {
    const accessToken = currentAuth?.session.accessToken
    if (accessToken) void revokeAuth(accessToken).catch(() => undefined)
    setCurrentAuth(null)
    clearAuth()
    goHome()
  }, [currentAuth?.session.accessToken, goHome])

  const openArticleManagement = useCallback(
    () => navigate({ page: 'admin-articles' }, '?admin=articles'),
    [navigate],
  )

  const openAdminAuth = useCallback((mode: AuthMode) => {
    if (mode === 'login' && canManageArticles(currentAuth?.session.role)) {
      openArticleManagement()
      return
    }
    navigate({ page: 'auth', mode, audience: 'admin' }, `?admin=${mode}`)
  }, [currentAuth?.session.role, navigate, openArticleManagement])

  const authenticateAdmin = useCallback((auth: StoredAuth) => {
    setCurrentAuth(auth)
    saveAuth(auth)
    openArticleManagement()
  }, [openArticleManagement])

  const logoutAdmin = useCallback(() => {
    const accessToken = currentAuth?.session.accessToken
    if (accessToken) void revokeAuth(accessToken).catch(() => undefined)
    setCurrentAuth(null)
    clearAuth()
    navigate({ page: 'auth', mode: 'login', audience: 'admin' }, '?admin=login')
  }, [currentAuth?.session.accessToken, navigate])

  const openCreateArticle = useCallback(
    () => navigate({ page: 'admin-create' }, '?admin=create-article'),
    [navigate],
  )

  const openEditArticle = useCallback(
    (id: number) => navigate({ page: 'admin-edit', id }, `?admin=edit-article&id=${id}`),
    [navigate],
  )

  const saveCreatedArticle = useCallback(async (input: ArticleWriteInput) => {
    const article = await createArticle(input)
    setArticleList((current) => [article, ...current.filter((item) => item.id !== article.id)])
  }, [])

  const saveCategory = useCallback(async (name: string) => {
    const category = await createCategory(name)
    setCategoryList((current) => [...current.filter((item) => item.id !== category.id), category]
      .sort((left, right) => left.name.localeCompare(right.name)))
    return category
  }, [])

  const saveEditedArticle = useCallback(async (id: number, input: ArticleWriteInput) => {
    const article = await updateArticle(id, input)
    setArticleList((current) => current.map((item) => item.id === id ? article : item))
  }, [])

  const deleteArticle = useCallback(async (id: number) => {
    setArticlesError('')
    try {
      await deleteArticleRequest(id)
      setArticleList((current) => current.filter((item) => item.id !== id))
    } catch (error) {
      setArticlesError(error instanceof Error ? error.message : 'Unable to delete article.')
      throw error
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => setView(viewFromLocation())

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const showAdminArticles = view.page === 'admin-articles'
    || (
      view.page === 'auth'
      && view.audience === 'admin'
      && view.mode === 'login'
      && canManageArticles(currentAuth?.session.role)
    )

  if (!authReady) return pageFallback

  if (view.page === 'member' && currentMember) {
    return (
      <Suspense fallback={pageFallback}>
        <MemberPage
          member={currentMember}
          view={view.view}
          onBack={goHome}
          onNavigate={openMemberView}
          onSave={saveMember}
          onPasswordChange={updateMemberPassword}
          onLogout={logoutMember}
        />
      </Suspense>
    )
  }

  if (view.page === 'auth' && !showAdminArticles) {
    const isAdmin = view.audience === 'admin'
    return (
      <Suspense fallback={pageFallback}>
        <AuthPage
          key={`${view.audience}-${view.mode}`}
          mode={view.mode}
          audience={view.audience}
          onBack={goHome}
          onModeChange={isAdmin ? openAdminAuth : openAuth}
          onAuthenticated={isAdmin ? authenticateAdmin : authenticateMember}
        />
      </Suspense>
    )
  }

  if (showAdminArticles) {
    if (!currentMember || !canManageArticles(currentAuth?.session.role)) {
      return <Suspense fallback={pageFallback}><AuthPage
        mode="login"
        audience="admin"
        onBack={goHome}
        onModeChange={openAdminAuth}
        onAuthenticated={authenticateAdmin}
      /></Suspense>
    }
    return (
      <Suspense fallback={pageFallback}><ArticleManagementPage
        onWebsite={goHome}
        onCreate={openCreateArticle}
        onEdit={openEditArticle}
        onDelete={deleteArticle}
        articles={articleList}
        categories={categoryList}
        loading={articlesLoading}
        error={articlesError}
        onLogout={logoutAdmin}
      /></Suspense>
    )
  }

  if (view.page === 'admin-create') {
    if (!currentMember || !canManageArticles(currentAuth?.session.role)) {
      return <Suspense fallback={pageFallback}><AuthPage
        mode="login"
        audience="admin"
        onBack={goHome}
        onModeChange={openAdminAuth}
        onAuthenticated={authenticateAdmin}
      /></Suspense>
    }
    return (
      <Suspense fallback={pageFallback}><ArticleEditorPage
        mode="create"
        author={currentMember}
        categories={categoryList}
        onCreateCategory={saveCategory}
        onArticles={openArticleManagement}
        onWebsite={goHome}
        onLogout={logoutAdmin}
        onSave={saveCreatedArticle}
      /></Suspense>
    )
  }

  if (view.page === 'admin-edit') {
    if (!currentMember || !canManageArticles(currentAuth?.session.role)) {
      return <Suspense fallback={pageFallback}><AuthPage
        mode="login"
        audience="admin"
        onBack={goHome}
        onModeChange={openAdminAuth}
        onAuthenticated={authenticateAdmin}
      /></Suspense>
    }
    const article = articleList.find((item) => item.id === view.id)
    if (article) {
      return (
        <Suspense fallback={pageFallback}><ArticleEditorPage
          key={article.id}
          mode="edit"
          article={article}
          author={currentMember}
          categories={categoryList}
          onCreateCategory={saveCategory}
          onArticles={openArticleManagement}
          onWebsite={goHome}
          onLogout={logoutAdmin}
          onDelete={() => {
            return deleteArticle(article.id).then(openArticleManagement)
          }}
          onSave={(input) => saveEditedArticle(article.id, input)}
        /></Suspense>
      )
    }
  }

  if (selectedArticle) {
    return (
      <Suspense fallback={pageFallback}><ArticlePage
        article={selectedArticle}
        member={currentMember}
        onBack={goHome}
        onAuthNavigate={openAuth}
        onMemberProfile={() => openMemberView('profile')}
        onMemberResetPassword={() => openMemberView('reset-password')}
        onLogout={logoutMember}
      /></Suspense>
    )
  }

  return (
    <div className="page">
      <SiteHeader
        member={currentMember}
        onHome={goHome}
        onLogin={() => openAuth('login')}
        onSignUp={() => openAuth('signup')}
        onProfile={() => openMemberView('profile')}
        onResetPassword={() => openMemberView('reset-password')}
        onLogout={logoutMember}
      />

      <main>
        <HeroSection articles={publishedArticles} onSelectArticle={openArticle} />

        <Suspense fallback={pageFallback}>
          <ArticleSection articles={publishedArticles} categories={categoryList} onSelectArticle={openArticle} />
        </Suspense>
      </main>

      <Footer action="admin" onAction={() => openAdminAuth('login')} />
    </div>
  )
}

export default App
