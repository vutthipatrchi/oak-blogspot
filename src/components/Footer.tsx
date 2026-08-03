import { Briefcase, Code, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FooterProps {
  action: 'admin' | 'home'
  variant?: 'light' | 'dark'
  onAction: () => void
}

export function Footer({ action, variant = 'light', onAction }: FooterProps) {
  const { t } = useTranslation()
  const isDark = variant === 'dark'

  return (
    <footer className={`footer${isDark ? ' footer--dark' : ''}`}>
      <div className="footer__left">
        <span className="footer__label">{t('footer.getInTouch')}</span>
        <div className="footer__social">
          <a href="#" aria-label="LinkedIn" className={`social-link${isDark ? ' social-link--dark' : ''}`}>
            <Briefcase aria-hidden="true" />
          </a>
          <a href="#" aria-label="GitHub" className={`social-link${isDark ? ' social-link--dark' : ''}`}>
            <Code aria-hidden="true" />
          </a>
          <a href="#" aria-label="Website" className={`social-link${isDark ? ' social-link--dark' : ''}`}>
            <Globe aria-hidden="true" />
          </a>
        </div>
      </div>
      <button
        type="button"
        className="footer__home footer__home--btn"
        onClick={onAction}
      >
        {t(action === 'admin' ? 'footer.adminPanel' : 'footer.homePage')}
      </button>
    </footer>
  )
}
