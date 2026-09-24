import { Briefcase, Code, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FooterProps {
  variant?: 'light' | 'dark'
  onHome?: () => void
}

export function Footer({ variant = 'light', onHome }: FooterProps) {
  const { t } = useTranslation()
  const isDark = variant === 'dark'

  return (
    <footer className={`footer${isDark ? ' footer--dark' : ''}`}>
      <div className="footer__left">
        <span className="footer__label">{t('footer.getInTouch')}</span>
        <div className="footer__social">
          <a href="https://www.linkedin.com/in/vutthipatr-chivorarerk-779981206/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={`social-link${isDark ? ' social-link--dark' : ''}`}>
            <Briefcase aria-hidden="true" />
          </a>
          <a href="https://github.com/vutthipatrchi" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={`social-link${isDark ? ' social-link--dark' : ''}`}>
            <Code aria-hidden="true" />
          </a>
          <a href="mailto:oak-vutthipatr@hotmail.com" aria-label="Email oak-vutthipatr@hotmail.com" className={`social-link${isDark ? ' social-link--dark' : ''}`}>
            <Mail aria-hidden="true" />
          </a>
        </div>
      </div>
      {onHome && (
        <button type="button" className="footer__home footer__home--btn" onClick={onHome}>
          {t('footer.homePage')}
        </button>
      )}
    </footer>
  )
}
