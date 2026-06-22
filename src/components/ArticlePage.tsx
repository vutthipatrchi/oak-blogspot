import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import type { Article } from '../data/articles'
import type { MemberProfile } from '../data/member'
import type { AuthMode } from './AuthPage'

interface ArticlePageProps {
  article: Article
  member: MemberProfile | null
  onBack: () => void
  onAuthNavigate: (mode: AuthMode) => void
  onMemberProfile: () => void
}

function SmileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 14s1.5 2 4 2 4-2 4-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function ArticlePage({ article, member, onBack, onAuthNavigate, onMemberProfile }: ArticlePageProps) {
  const [likes, setLikes] = useState(article.likes)
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy link')
  const [showCommentAuth, setShowCommentAuth] = useState(false)
  const closeModalRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!showCommentAuth) return

    closeModalRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowCommentAuth(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCommentAuth])

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1)
      setLiked(false)
    } else {
      setLikes((prev) => prev + 1)
      setLiked(true)
    }
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?article=${article.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy link'), 2000)
    } catch {
      setCopyLabel('Failed')
      setTimeout(() => setCopyLabel('Copy link'), 2000)
    }
  }

  const handleSendComment = (e: FormEvent) => {
    e.preventDefault()
    setShowCommentAuth(true)
  }

  const handleModalBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setShowCommentAuth(false)
  }

  return (
    <div className="article-page">
      <div className="page">
        <header className="header header--dark">
          <button type="button" className="logo logo--btn" onClick={onBack}>
            hh.
          </button>
          {member ? (
            <div className="member-nav">
              <button type="button" className="member-nav__bell" aria-label="Notifications">♧</button>
              <button type="button" className="member-nav__profile" onClick={onMemberProfile}>
                <img src={member.avatar} alt="" />
                <span>{member.name}</span>
                <span aria-hidden="true">⌄</span>
              </button>
            </div>
          ) : (
            <div className="header__actions">
              <button type="button" className="btn btn--outline btn--dark" onClick={() => onAuthNavigate('login')}>
                Log in
              </button>
              <button type="button" className="btn btn--solid btn--dark-solid" onClick={() => onAuthNavigate('signup')}>
                Sign up
              </button>
            </div>
          )}
        </header>

        <article className="article-detail">
          <img
            src={article.image}
            alt=""
            className="article-detail__hero"
          />

          <div className="article-detail__layout">
            <div className="article-detail__main">
              <div className="article-detail__meta">
                <span className="article-detail__tag">{article.category}</span>
                {article.tags.map((tag) => (
                  <span key={tag} className="article-detail__topic">{tag}</span>
                ))}
                <time className="article-detail__date">{article.date}</time>
              </div>

              <h1 className="article-detail__title">{article.title}</h1>

              <div className="article-detail__body">
                {article.sections.map((section, index) => (
                  <section key={index} className="article-detail__section">
                    {section.title && (
                      <h2 className="article-detail__heading">{section.title}</h2>
                    )}
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex} className="article-detail__paragraph">
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="article-detail__list">
                        {section.bullets.map((bullet) => (
                          <li key={bullet.term}>
                            <strong>{bullet.term}:</strong> {bullet.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {article.source && (
                <p className="article-detail__source">
                  แหล่งข้อมูล:{' '}
                  <a href={article.source.url} target="_blank" rel="noreferrer">
                    {article.source.label}
                  </a>
                </p>
              )}

              <div className="article-detail__actions">
                <button
                  type="button"
                  className={`action-btn action-btn--like${liked ? ' action-btn--liked' : ''}`}
                  onClick={handleLike}
                >
                  <SmileIcon />
                  <span>{likes.toLocaleString()}</span>
                </button>
                <button
                  type="button"
                  className="action-btn action-btn--copy"
                  onClick={handleCopyLink}
                >
                  <LinkIcon />
                  <span>{copyLabel}</span>
                </button>
                <div className="article-detail__social">
                  <a href="#" aria-label="Share on Facebook" className="social-share social-share--facebook">
                    <FacebookIcon />
                  </a>
                  <a href="#" aria-label="Share on LinkedIn" className="social-share social-share--linkedin">
                    <LinkedInIcon />
                  </a>
                  <a href="#" aria-label="Share on X" className="social-share social-share--twitter">
                    <TwitterIcon />
                  </a>
                </div>
              </div>

              <section className="comments">
                <h2 className="comments__title">Comment</h2>
                <form className="comment-form" onSubmit={handleSendComment}>
                  <textarea
                    className="comment-form__input"
                    placeholder="What are your thoughts?"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onClick={() => setShowCommentAuth(true)}
                    onFocus={() => setShowCommentAuth(true)}
                    rows={4}
                  />
                  <div className="comment-form__footer">
                    <button type="submit" className="comment-form__send">
                      Send
                    </button>
                  </div>
                </form>

                <ul className="comments__list">
                  {article.comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <img
                        src={comment.avatar}
                        alt=""
                        className="comment-item__avatar"
                      />
                      <div className="comment-item__content">
                        <div className="comment-item__header">
                          <span className="comment-item__author">{comment.author}</span>
                          <time className="comment-item__date">{comment.date}</time>
                        </div>
                        <p className="comment-item__text">{comment.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="article-detail__sidebar">
              <div className="author-card">
                <span className="author-card__label">Author</span>
                <div className="author-card__profile">
                  <img
                    src={article.authorAvatar}
                    alt=""
                    className="author-card__avatar"
                  />
                  <span className="author-card__name">{article.author}</span>
                </div>
                {article.authorBio.map((paragraph, index) => (
                  <p key={index} className="author-card__bio">
                    {paragraph}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </article>

        <footer className="footer footer--dark">
          <div className="footer__left">
            <span className="footer__label">Get in touch</span>
            <div className="footer__social">
              <a href="#" aria-label="LinkedIn" className="social-link social-link--dark">
                <LinkedInIcon />
              </a>
              <a href="#" aria-label="GitHub" className="social-link social-link--dark">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              <a href="#" aria-label="Website" className="social-link social-link--dark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </a>
            </div>
          </div>
          <button type="button" className="footer__home footer__home--btn" onClick={onBack}>
            Home page
          </button>
        </footer>
      </div>

      {showCommentAuth && (
        <div className="comment-auth-overlay" onMouseDown={handleModalBackdrop}>
          <div
            className="comment-auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comment-auth-title"
          >
            <button
              ref={closeModalRef}
              type="button"
              className="comment-auth-modal__close"
              aria-label="Close"
              onClick={() => setShowCommentAuth(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
            <h2 id="comment-auth-title" className="comment-auth-modal__title">
              Create an account to continue
            </h2>
            <button type="button" className="comment-auth-modal__primary" onClick={() => onAuthNavigate('signup')}>
              Create account
            </button>
            <p className="comment-auth-modal__login">
              Already have an account?{' '}
              <button type="button" className="comment-auth-modal__login-btn" onClick={() => onAuthNavigate('login')}>
                Log in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
