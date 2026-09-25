import { useTranslation } from 'react-i18next'
import type { MemberProfile } from '../data/member'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ProfileMenu } from './ProfileMenu'
import { NotificationBell } from './NotificationBell'
import { BrandLogo } from './BrandLogo'

interface SiteHeaderProps {
  member?: MemberProfile | null
  variant?: 'light' | 'dark'
  activeAuthMode?: 'login' | 'signup'
  className?: string
  onHome: () => void
  onLogin?: () => void
  onSignUp?: () => void
  onProfile?: () => void
  onResetPassword?: () => void
  onAdminPanel?: () => void
  onLogout?: () => void
  onOpenArticle?: (articleId: number) => void
}

export function SiteHeader({
  member = null,
  variant = 'light',
  activeAuthMode,
  className = '',
  onHome,
  onLogin,
  onSignUp,
  onProfile,
  onResetPassword,
  onAdminPanel,
  onLogout,
  onOpenArticle = () => undefined,
}: SiteHeaderProps) {
  const { t } = useTranslation()
  const isDark = variant === 'dark'
  const headerClassName = [
    'site-header',
    isDark ? 'site-header--dark' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClassName}>
      <button type="button" className="site-header__logo" onClick={onHome}>
        <BrandLogo />
      </button>

      {member && onProfile && onResetPassword && onLogout ? (
        <div className="site-header__actions">
          <LanguageSwitcher variant={variant} />
          <NotificationBell onOpenArticle={onOpenArticle} />
          <ProfileMenu
            member={member}
            buttonClassName="site-header__profile"
            onProfile={onProfile}
            onResetPassword={onResetPassword}
            onAdminPanel={onAdminPanel}
            onLogout={onLogout}
          />
        </div>
      ) : (
        <div className="site-header__actions">
          <LanguageSwitcher variant={variant} />
          {onLogin && (
            <button
              type="button"
              className={`btn ${activeAuthMode === 'login' ? 'btn--solid' : 'btn--outline'}`}
              onClick={onLogin}
            >
              {t('common.login')}
            </button>
          )}
          {onSignUp && (
            <button
              type="button"
              className={`btn ${activeAuthMode === 'login' ? 'btn--outline' : 'btn--solid'}`}
              onClick={onSignUp}
            >
              {t('common.signup')}
            </button>
          )}
        </div>
      )}
    </header>
  )
}
