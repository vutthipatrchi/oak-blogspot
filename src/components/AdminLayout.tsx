import type { ReactNode } from 'react'
import {
  BookOpen,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NotificationBell } from './NotificationBell'
import { BrandLogo } from './BrandLogo'

interface AdminLayoutProps {
  children: ReactNode
  onArticles?: () => void
  onWebsite: () => void
  onLogout: () => void
  onOpenArticle?: (articleId: number) => void
}

export default function AdminLayout({
  children,
  onArticles,
  onWebsite,
  onLogout,
  onOpenArticle = () => undefined,
}: AdminLayoutProps) {
  const { t } = useTranslation()
  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar" aria-label="Admin navigation">
        <div>
          <button type="button" className="admin-shell__brand" onClick={onWebsite}>
            <BrandLogo />
          </button>
          <p className="admin-shell__eyebrow">Admin panel</p>
          <div className="admin-shell__notifications">
            <NotificationBell onOpenArticle={onOpenArticle} />
            <span>{t('common.notifications')}</span>
          </div>
          <nav className="admin-shell__nav">
            <button
              type="button"
              className="admin-shell__nav-item admin-shell__nav-item--active"
              onClick={onArticles}
            >
              <BookOpen size={20} strokeWidth={1.6} />
              <span>Article management</span>
            </button>
          </nav>
        </div>
        <div className="admin-shell__footer">
          <button type="button" className="admin-shell__footer-btn" onClick={onWebsite}>
            <ExternalLink size={19} strokeWidth={1.6} />
            <span>One More Page website</span>
          </button>
          <button type="button" className="admin-shell__footer-btn" onClick={onLogout}>
            <LogOut size={19} strokeWidth={1.6} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      {children}
    </div>
  )
}
