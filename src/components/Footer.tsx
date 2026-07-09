import { Briefcase, Code, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FooterProps {
  onAdminLogin: () => void
}

export function Footer({ onAdminLogin }: FooterProps) {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer__left">
        <span className="footer__label">{t('footer.getInTouch')}</span>
        <div className="footer__social">
          <a href="#" aria-label="LinkedIn" className="social-link">
            <Briefcase aria-hidden="true" />
          </a>
          <a href="#" aria-label="GitHub" className="social-link">
            <Code aria-hidden="true" />
          </a>
          <a href="#" aria-label="Website" className="social-link">
            <Globe aria-hidden="true" />
          </a>
        </div>
      </div>
      <button
        type="button"
        className="footer__home footer__home--btn"
        onClick={onAdminLogin}
      >
        {t('footer.adminPanel')}
      </button>
    </footer>
  )
}
