import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Article } from '../data/articles'
import type { MemberProfile } from '../data/member'
import { createArticleComment, toggleArticleLike } from '../lib/articles'
import type { AuthMode } from './AuthPage'
import { Footer } from './Footer'
import { SiteHeader } from './SiteHeader'

interface ArticlePageProps {
  article: Article
  member: MemberProfile | null
  onBack: () => void
  onAuthNavigate: (mode: AuthMode) => void
  onMemberProfile: () => void
  onMemberResetPassword: () => void
  onLogout: () => void
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

export default function ArticlePage({
  article,
  member,
  onBack,
  onAuthNavigate,
  onMemberProfile,
  onMemberResetPassword,
  onLogout,
}: ArticlePageProps) {
  const { t } = useTranslation()
  const [likes, setLikes] = useState(article.likes)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState(article.comments)
  const [commentText, setCommentText] = useState('')
  const [interactionError, setInteractionError] = useState('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
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

  const handleLike = async () => {
    if (!member) {
      setShowCommentAuth(true)
      return
    }
    setInteractionError('')
    try {
      const result = await toggleArticleLike(article.id)
      setLikes(result.likes)
      setLiked(result.liked)
    } catch (error) {
      setInteractionError(error instanceof Error ? error.message : 'Unable to update like.')
    }
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?article=${article.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('failed')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const handleSendComment = async (e: FormEvent) => {
    e.preventDefault()
    if (!member) {
      setShowCommentAuth(true)
      return
    }
    const text = commentText.trim()
    if (!text) return
    setInteractionError('')
    try {
      const comment = await createArticleComment(article.id, text)
      setComments((current) => [...current, comment])
      setCommentText('')
    } catch (error) {
      setInteractionError(error instanceof Error ? error.message : 'Unable to post comment.')
    }
  }

  const handleModalBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setShowCommentAuth(false)
  }

  return (
    <div className="article-page">
      <div className="page">
        <SiteHeader
          variant="dark"
          member={member}
          onHome={onBack}
          onLogin={() => onAuthNavigate('login')}
          onSignUp={() => onAuthNavigate('signup')}
          onProfile={onMemberProfile}
          onResetPassword={onMemberResetPassword}
          onLogout={onLogout}
        />

        <article className="article-detail">
          <img
            src={article.image}
            alt=""
            className="article-detail__hero"
          />

          <div className="article-detail__layout">
            <div className="article-detail__main">
              <div className="article-detail__meta">
                <span className="article-detail__tag">{t(`articles.categories.${article.category}`)}</span>
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
                  {t('article.sourceLabel')}:{' '}
                  <a href={article.source.url} target="_blank" rel="noreferrer">
                    {article.source.label}
                  </a>
                </p>
              )}

              <div className="article-detail__actions">
                <button
                  type="button"
                  className={`action-btn action-btn--like${liked ? ' action-btn--liked' : ''}`}
                  onClick={() => void handleLike()}
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
                  <span>{t(`article.${copyStatus === 'idle' ? 'copyLink' : copyStatus}`)}</span>
                </button>
                <div className="article-detail__social">
                  <a href="#" aria-label={t('article.shareFacebook')} className="social-share social-share--facebook">
                    <FacebookIcon />
                  </a>
                  <a href="#" aria-label={t('article.shareLinkedIn')} className="social-share social-share--linkedin">
                    <LinkedInIcon />
                  </a>
                  <a href="#" aria-label={t('article.shareX')} className="social-share social-share--twitter">
                    <TwitterIcon />
                  </a>
                </div>
              </div>

              <section className="comments">
                <h2 className="comments__title">{t('article.commentTitle')}</h2>
                <form className="comment-form" onSubmit={handleSendComment}>
                  <textarea
                    className="comment-form__input"
                    placeholder={t('article.commentPlaceholder')}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onClick={() => { if (!member) setShowCommentAuth(true) }}
                    onFocus={() => { if (!member) setShowCommentAuth(true) }}
                    rows={4}
                  />
                  <div className="comment-form__footer">
                    <button type="submit" className="comment-form__send">
                      {t('article.send')}
                    </button>
                  </div>
                </form>

                {interactionError && (
                  <p className="member-message member-message--error" role="alert">{interactionError}</p>
                )}

                <ul className="comments__list">
                  {comments.map((comment) => (
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
                <span className="author-card__label">{t('article.author')}</span>
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

        <Footer action="home" variant="dark" onAction={onBack} />
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
              aria-label={t('article.close')}
              onClick={() => setShowCommentAuth(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
            <h2 id="comment-auth-title" className="comment-auth-modal__title">
              {t('article.commentAuthTitle')}
            </h2>
            <button type="button" className="comment-auth-modal__primary" onClick={() => onAuthNavigate('signup')}>
              {t('article.createAccount')}
            </button>
            <p className="comment-auth-modal__login">
              {t('article.alreadyHaveAccount')}{' '}
              <button type="button" className="comment-auth-modal__login-btn" onClick={() => onAuthNavigate('login')}>
                {t('common.login')}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
