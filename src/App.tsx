import { useCallback, useEffect, useState } from 'react'
import ArticlePage from './components/ArticlePage'
import ArticleSection from './components/ArticleSection'
import AdminLoginPage from './components/AdminLoginPage'
import AuthPage, { type AuthMode } from './components/AuthPage'
import MemberPage, { type MemberView } from './components/MemberPage'
import { Footer } from './components/Footer'
import { NavBar } from './components/NavBar'
import { HeroSection } from './components/HeroSection'
import type { MemberProfile } from './data/member'
import { articles as staticArticles } from './data/articles'
import { fetchArticles } from './lib/articles'
import { isSupabaseConfigured } from './lib/supabase'
import './App.css'

function App() {
  const [articleList, setArticleList] = useState(staticArticles)
  const [currentMember, setCurrentMember] = useState<MemberProfile | null>(() => {
    try {
      const savedMember = window.localStorage.getItem('hh.member')
      return savedMember ? JSON.parse(savedMember) as MemberProfile : null
    } catch {
      return null
    }
  })
  const [memberView, setMemberView] = useState<MemberView | null>(() => {
    const view = new URLSearchParams(window.location.search).get('member')
    return view === 'profile' || view === 'reset-password' ? view : null
  })
  const [showAdminLogin, setShowAdminLogin] = useState(
    () => new URLSearchParams(window.location.search).get('admin') === 'login',
  )
  const [authMode, setAuthMode] = useState<AuthMode | null>(() => {
    const mode = new URLSearchParams(window.location.search).get('auth')
    return mode === 'signup' || mode === 'login' ? mode : null
  })
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    () => {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('article')
      return id ? Number(id) : null
    },
  )

  const selectedArticle = selectedArticleId
    ? articleList.find((article) => article.id === selectedArticleId)
    : undefined

  useEffect(() => {
    if (!isSupabaseConfigured && !import.meta.env.VITE_API_BASE_URL) return

    let ignore = false

    fetchArticles()
      .then((loadedArticles) => {
        if (!ignore && loadedArticles.length > 0) {
          setArticleList(loadedArticles)
        }
      })
      .catch((error: unknown) => {
        console.warn('Unable to load articles. Falling back to static articles.', error)
      })

    return () => {
      ignore = true
    }
  }, [])

  const openArticle = useCallback((id: number) => {
    setMemberView(null)
    setShowAdminLogin(false)
    setAuthMode(null)
    setSelectedArticleId(id)
    window.history.pushState({}, '', `?article=${id}`)
    window.scrollTo(0, 0)
  }, [])

  const closeArticle = useCallback(() => {
    setAuthMode(null)
    setSelectedArticleId(null)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  const openAuth = useCallback((mode: AuthMode) => {
    setMemberView(null)
    setShowAdminLogin(false)
    setSelectedArticleId(null)
    setAuthMode(mode)
    window.history.pushState({}, '', `?auth=${mode}`)
    window.scrollTo(0, 0)
  }, [])

  const closeAuth = useCallback(() => {
    setAuthMode(null)
    setSelectedArticleId(null)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  const openAdminLogin = useCallback(() => {
    setMemberView(null)
    setAuthMode(null)
    setSelectedArticleId(null)
    setShowAdminLogin(true)
    window.history.pushState({}, '', '?admin=login')
    window.scrollTo(0, 0)
  }, [])

  const openMemberView = useCallback((view: MemberView) => {
    if (!currentMember) {
      openAuth('login')
      return
    }
    setAuthMode(null)
    setShowAdminLogin(false)
    setSelectedArticleId(null)
    setMemberView(view)
    window.history.pushState({}, '', `?member=${view}`)
    window.scrollTo(0, 0)
  }, [currentMember, openAuth])

  const closeMemberView = useCallback(() => {
    setMemberView(null)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  const saveMember = useCallback((member: MemberProfile) => {
    setCurrentMember(member)
    window.localStorage.setItem('hh.member', JSON.stringify(member))
  }, [])

  const authenticateMember = useCallback((member: MemberProfile) => {
    saveMember(member)
    setAuthMode(null)
    setMemberView(null)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [saveMember])

  const logoutMember = useCallback(() => {
    setCurrentMember(null)
    window.localStorage.removeItem('hh.member')
    setMemberView(null)
    setAuthMode(null)
    setSelectedArticleId(null)
    setShowAdminLogin(false)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  const closeAdminLogin = useCallback(() => {
    setShowAdminLogin(false)
    window.history.pushState({}, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('article')
      const mode = params.get('auth')
      const member = params.get('member')
      setShowAdminLogin(params.get('admin') === 'login')
      setMemberView(member === 'profile' || member === 'reset-password' ? member : null)
      setSelectedArticleId(id ? Number(id) : null)
      setAuthMode(mode === 'signup' || mode === 'login' ? mode : null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (memberView && currentMember) {
    return (
      <MemberPage
        member={currentMember}
        view={memberView}
        onBack={closeMemberView}
        onNavigate={openMemberView}
        onSave={saveMember}
        onLogout={logoutMember}
      />
    )
  }

  if (showAdminLogin) {
    return <AdminLoginPage onBack={closeAdminLogin} />
  }

  if (authMode) {
    return (
      <AuthPage
        key={authMode}
        mode={authMode}
        onBack={closeAuth}
        onModeChange={openAuth}
        onAuthenticated={authenticateMember}
      />
    )
  }

  if (selectedArticle) {
    return (
      <ArticlePage
        article={selectedArticle}
        member={currentMember}
        onBack={closeArticle}
        onAuthNavigate={openAuth}
        onMemberProfile={() => openMemberView('profile')}
        onMemberResetPassword={() => openMemberView('reset-password')}
        onLogout={logoutMember}
      />
    )
  }

  return (
    <div className="page">
      <NavBar
        member={currentMember}
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

      <Footer onAdminLogin={openAdminLogin} />
    </div>
  )
}

export default App
