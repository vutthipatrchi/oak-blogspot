import { useCallback, useEffect, useMemo, useState } from 'react'
import ArticlePage from './components/ArticlePage'
import AdminLoginPage from './components/AdminLoginPage'
import AuthPage, { type AuthMode } from './components/AuthPage'
import MemberPage, { type MemberView } from './components/MemberPage'
import HeroBook from './components/HeroBook'
import type { MemberProfile } from './data/member'
import {
  articles,
  categories,
  getArticleById,
  type Article,
  type Category,
} from './data/articles'
import './App.css'

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function ArticleCard({
  article,
  onSelect,
}: {
  article: Article
  onSelect: (id: number) => void
}) {
  return (
    <article
      className="article-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(article.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(article.id)
        }
      }}
    >
      <img
        src={article.image}
        alt=""
        className="article-card__image"
        loading="lazy"
      />
      <div className="article-card__tags">
        <span className="article-card__tag">{article.category}</span>
        {article.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="article-card__topic">{tag}</span>
        ))}
      </div>
      <h3 className="article-card__title">{article.title}</h3>
      <p className="article-card__excerpt">{article.excerpt}</p>
      <div className="article-card__meta">
        <img
          src={article.authorAvatar}
          alt=""
          className="article-card__avatar"
        />
        <span className="article-card__author">{article.author}</span>
        <span className="article-card__date">{article.date}</span>
      </div>
    </article>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('Highlight')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
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
    ? getArticleById(selectedArticleId)
    : undefined

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

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'Highlight' || article.category === activeCategory
      const searchableText = [
        article.title,
        article.excerpt,
        article.category,
        ...article.tags,
        article.author,
        ...article.sections.flatMap((section) => [
          section.title ?? '',
          ...section.paragraphs,
          ...(section.bullets?.flatMap((bullet) => [bullet.term, bullet.description]) ?? []),
        ]),
      ]
        .join(' ')
        .toLowerCase()
      const matchesSearch = query === '' || searchableText.includes(query)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const searchSuggestions = searchQuery.trim()
    ? filteredArticles.slice(0, 3)
    : []

  if (memberView && currentMember) {
    return (
      <MemberPage
        member={currentMember}
        view={memberView}
        onBack={closeMemberView}
        onNavigate={openMemberView}
        onSave={saveMember}
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
      />
    )
  }

  return (
    <div className="page">
      <header className="header">
        <a href="/" className="logo">
          hh.
        </a>
        {currentMember ? (
          <div className="member-nav">
            <button type="button" className="member-nav__bell" aria-label="Notifications">♧</button>
            <button type="button" className="member-nav__profile" onClick={() => openMemberView('profile')}>
              <img src={currentMember.avatar} alt="" />
              <span>{currentMember.name}</span>
              <span aria-hidden="true">⌄</span>
            </button>
          </div>
        ) : (
          <div className="header__actions">
            <button type="button" className="btn btn--outline" onClick={() => openAuth('login')}>
              Log in
            </button>
            <button type="button" className="btn btn--solid" onClick={() => openAuth('signup')}>
              Sign up
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="hero__text">
            <h1 className="hero__title">
              Stay
              <br />
              Informed,
              <br />
              Stay Inspired
            </h1>
            <p className="hero__subtitle">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose
              of Inspiration and Information.
            </p>
          </div>

          <HeroBook articles={articles} onSelectArticle={openArticle} />

          <div className="hero__author">
            <span className="hero__author-label">-About this archive</span>
            <h2 className="hero__author-name">Thinkers &amp; Writers</h2>
            <p className="hero__author-bio">
              พื้นที่รวบรวมเรื่องราวของนักคิดและนักเขียนที่เราชื่นชอบ
              ผ่านบทความ ประวัติ แนวคิด และผลงานที่น่าสนใจ
            </p>
            <p className="hero__author-bio">
              เปิดหนังสือเล่มกลางเพื่อไล่ดูภาพ และเลือกหน้าที่ต้องการเพื่ออ่านบทความฉบับเต็ม
            </p>
          </div>
        </section>

        <section className="articles-section">
          <h2 className="articles-section__title">Latest articles</h2>

          <div className="articles-toolbar">
            <div className="articles-toolbar__filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-btn${activeCategory === category ? ' filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div
              className="search-box"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setSearchFocused(false)
                  setActiveSuggestionIndex(-1)
                }
              }}
            >
              <label htmlFor="article-search" className="visually-hidden">
                Search articles
              </label>
              <input
                id="article-search"
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchFocused(true)
                  setActiveSuggestionIndex(-1)
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && searchSuggestions.length > 0) {
                    e.preventDefault()
                    setActiveSuggestionIndex((current) =>
                      current < searchSuggestions.length - 1 ? current + 1 : 0,
                    )
                  } else if (e.key === 'ArrowUp' && searchSuggestions.length > 0) {
                    e.preventDefault()
                    setActiveSuggestionIndex((current) =>
                      current > 0 ? current - 1 : searchSuggestions.length - 1,
                    )
                  } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                    e.preventDefault()
                    openArticle(searchSuggestions[activeSuggestionIndex].id)
                  } else if (e.key === 'Escape') {
                    setSearchQuery('')
                    setSearchFocused(false)
                    setActiveSuggestionIndex(-1)
                  }
                }}
                aria-controls="search-results articles-grid"
                aria-expanded={searchFocused && searchQuery.trim() !== ''}
                aria-autocomplete="list"
                aria-activedescendant={
                  activeSuggestionIndex >= 0
                    ? `search-result-${searchSuggestions[activeSuggestionIndex].id}`
                    : undefined
                }
                autoComplete="off"
                className="search-box__input"
              />
              <span className="search-box__icon">
                <SearchIcon />
              </span>

              {searchFocused && searchQuery.trim() !== '' && (
                <div className="search-results" id="search-results" role="listbox">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((article, index) => (
                      <button
                        key={article.id}
                        id={`search-result-${article.id}`}
                        type="button"
                        role="option"
                        aria-selected={activeSuggestionIndex === index}
                        className={`search-results__item${activeSuggestionIndex === index ? ' search-results__item--active' : ''}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => openArticle(article.id)}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                      >
                        {article.title}
                      </button>
                    ))
                  ) : (
                    <p className="search-results__empty">No matching articles</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="visually-hidden" role="status" aria-live="polite">
            {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} found
          </p>

          <div className="articles-grid" id="articles-grid">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelect={openArticle}
              />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <p className="articles-empty">
              No articles found{searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ''}.
            </p>
          )}

          <div className="view-more">
            <a href="#articles" className="view-more__link">
              View more
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__left">
          <span className="footer__label">Get in touch</span>
          <div className="footer__social">
            <a href="#" aria-label="LinkedIn" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a href="#" aria-label="Website" className="social-link">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </a>
          </div>
        </div>
        <button type="button" className="footer__home footer__home--btn" onClick={openAdminLogin}>
          Admin panel
        </button>
      </footer>
    </div>
  )
}

export default App
