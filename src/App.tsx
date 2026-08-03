import { useCallback, useEffect, useState } from 'react'
import ArticlePage from './components/ArticlePage'
import ArticleSection from './components/ArticleSection'
import ArticleManagementPage from './components/ArticleManagementPage'
import ArticleEditorPage from './components/ArticleEditorPage'
import AuthPage, { type AuthMode } from './components/AuthPage'
import MemberPage, { type MemberView } from './components/MemberPage'
import { Footer } from './components/Footer'
import { HeroSection } from './components/HeroSection'
import { SiteHeader } from './components/SiteHeader'
import type { MemberProfile } from './data/member'
import { articles as staticArticles } from './data/articles'
import { createArticle, deleteArticle as deleteArticleRequest, fetchArticles, updateArticle, type ArticleWriteInput } from './lib/articles'
import './App.css'

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
  const [currentMember, setCurrentMember] = useState<MemberProfile | null>(() => {
    try {
      const savedMember = window.localStorage.getItem('hh.member')
      return savedMember ? JSON.parse(savedMember) as MemberProfile : null
    } catch {
      return null
    }
  })
  const [view, setView] = useState<AppView>(viewFromLocation)

  const selectedArticle = view.page === 'article'
    ? articleList.find((article) => article.id === view.id)
    : undefined

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

  const openAdminAuth = useCallback(
    (mode: AuthMode) => navigate({ page: 'auth', mode, audience: 'admin' }, `?admin=${mode}`),
    [navigate],
  )

  const openMemberView = useCallback((memberView: MemberView) => {
    if (!currentMember) {
      openAuth('login')
      return
    }
    navigate({ page: 'member', view: memberView }, `?member=${memberView}`)
  }, [currentMember, navigate, openAuth])

  const saveMember = useCallback((member: MemberProfile) => {
    setCurrentMember(member)
    window.localStorage.setItem('hh.member', JSON.stringify(member))
  }, [])

  const authenticateMember = useCallback((member: MemberProfile) => {
    saveMember(member)
    navigate({ page: 'member', view: 'profile' }, '?member=profile')
  }, [navigate, saveMember])

  const logoutMember = useCallback(() => {
    setCurrentMember(null)
    window.localStorage.removeItem('hh.member')
    goHome()
  }, [goHome])

  const openArticleManagement = useCallback(
    () => navigate({ page: 'admin-articles' }, '?admin=articles'),
    [navigate],
  )

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

  if (view.page === 'member' && currentMember) {
    return (
      <MemberPage
        member={currentMember}
        view={view.view}
        onBack={goHome}
        onNavigate={openMemberView}
        onSave={saveMember}
        onLogout={logoutMember}
      />
    )
  }

  if (view.page === 'auth') {
    const isAdmin = view.audience === 'admin'
    return (
      <AuthPage
        key={`${view.audience}-${view.mode}`}
        mode={view.mode}
        audience={view.audience}
        onBack={goHome}
        onModeChange={isAdmin ? openAdminAuth : openAuth}
        onAuthenticated={isAdmin ? openArticleManagement : authenticateMember}
      />
    )
  }

  if (view.page === 'admin-articles') {
    return (
      <ArticleManagementPage
        onWebsite={goHome}
        onCreate={openCreateArticle}
        onEdit={openEditArticle}
        onDelete={deleteArticle}
        articles={articleList}
        loading={articlesLoading}
        error={articlesError}
        onLogout={() => openAdminAuth('login')}
      />
    )
  }

  if (view.page === 'admin-create') {
    return (
      <ArticleEditorPage
        mode="create"
        onArticles={openArticleManagement}
        onWebsite={goHome}
        onLogout={() => openAdminAuth('login')}
        onSave={saveCreatedArticle}
      />
    )
  }

  if (view.page === 'admin-edit') {
    const article = articleList.find((item) => item.id === view.id)
    if (article) {
      return (
        <ArticleEditorPage
          key={article.id}
          mode="edit"
          article={article}
          onArticles={openArticleManagement}
          onWebsite={goHome}
          onLogout={() => openAdminAuth('login')}
          onDelete={() => {
            return deleteArticle(article.id).then(openArticleManagement)
          }}
          onSave={(input) => saveEditedArticle(article.id, input)}
        />
      )
    }
  }

  if (selectedArticle) {
    return (
      <ArticlePage
        article={selectedArticle}
        member={currentMember}
        onBack={goHome}
        onAuthNavigate={openAuth}
        onMemberProfile={() => openMemberView('profile')}
        onMemberResetPassword={() => openMemberView('reset-password')}
        onLogout={logoutMember}
      />
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
        <HeroSection articles={articleList} onSelectArticle={openArticle} />

        <ArticleSection articles={articleList} onSelectArticle={openArticle} />
      </main>

      <Footer action="admin" onAction={() => openAdminAuth('login')} />
    </div>
  )
}

export default App
