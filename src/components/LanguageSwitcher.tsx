import { Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supportedLanguages, type SupportedLanguage } from '../i18n'

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'
  className?: string
}

const languageLabels: Record<SupportedLanguage, string> = {
  th: 'TH',
  en: 'EN',
}

export function LanguageSwitcher({ variant = 'light', className = '' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const currentLanguage = supportedLanguages.includes(i18n.language as SupportedLanguage)
    ? i18n.language as SupportedLanguage
    : 'th'

  return (
    <div className={`language-switcher language-switcher--${variant} ${className}`.trim()} aria-label={t('common.language')}>
      <Globe2 className="language-switcher__icon" size={16} strokeWidth={1.7} aria-hidden="true" />
      {supportedLanguages.map((language) => (
        <button
          key={language}
          type="button"
          className={`language-switcher__button${currentLanguage === language ? ' language-switcher__button--active' : ''}`}
          onClick={() => void i18n.changeLanguage(language)}
          aria-pressed={currentLanguage === language}
          aria-label={t('common.switchLanguage', {
            language: t(language === 'th' ? 'common.thai' : 'common.english'),
          })}
        >
          {languageLabels[language]}
        </button>
      ))}
    </div>
  )
}
