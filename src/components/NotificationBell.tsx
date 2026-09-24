import { useCallback, useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchNotifications, markNotificationsRead, type AppNotification } from '../lib/articles'

interface NotificationBellProps {
  onOpenArticle: (articleId: number) => void
}

export function NotificationBell({ onOpenArticle }: NotificationBellProps) {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    try {
      const result = await fetchNotifications()
      setItems(result.notifications)
      setUnreadCount(result.unreadCount)
    } catch {
      // Keep the header usable if the notification service is temporarily offline.
    }
  }, [])

  useEffect(() => {
    void refresh()
    const interval = window.setInterval(() => void refresh(), 45_000)
    const onFocus = () => void refresh()
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [refresh])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const toggleOpen = async () => {
    const next = !open
    setOpen(next)
    if (next) {
      await refresh()
      await markNotificationsRead().then(() => {
        setUnreadCount(0)
        setItems((current) => current.map((item) => item.readAt ? item : { ...item, readAt: new Date().toISOString() }))
      }).catch(() => undefined)
    }
  }

  const eventLabel = (item: AppNotification) => {
    const eventKey: Record<AppNotification['eventType'], string> = {
      new_comment: 'notifications.newComment',
      article_like: 'notifications.articleLike',
      comment_reply: 'notifications.commentReply',
      comment_like: 'notifications.commentLike',
    }
    return t(eventKey[item.eventType], { actor: item.actorName, title: item.articleTitle })
  }

  return (
    <div className="notification-menu" ref={rootRef}>
      <button
        type="button"
        className="site-header__notification"
        aria-label={t('common.notifications')}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggleOpen}
      >
        <Bell size={20} strokeWidth={1.7} aria-hidden="true" />
        {unreadCount > 0 && <span className="notification-menu__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {open && (
        <section className="notification-menu__panel" role="dialog" aria-label={t('common.notifications')}>
          <h2 className="notification-menu__title">{t('common.notifications')}</h2>
          {items.length === 0 ? (
            <p className="notification-menu__empty">{t('notifications.empty')}</p>
          ) : (
            <ul className="notification-menu__list">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`notification-menu__item${item.readAt ? '' : ' notification-menu__item--unread'}`}
                    onClick={() => { setOpen(false); onOpenArticle(item.articleId) }}
                  >
                    <span className="notification-menu__message">{eventLabel(item)}</span>
                    {item.commentPreview && <span className="notification-menu__preview">{item.commentPreview}</span>}
                    <time className="notification-menu__date" dateTime={item.createdAt}>
                      {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt))}
                    </time>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
