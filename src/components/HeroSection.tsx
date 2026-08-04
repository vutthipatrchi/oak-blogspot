import type { Article } from '../data/articles'
import { useTranslation } from 'react-i18next'
import HeroBook from './HeroBook'

interface HeroSectionProps {
  articles: Article[]
  onSelectArticle: (id: number) => void
}

export function HeroSection({ articles, onSelectArticle }: HeroSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="hero-section">
      <div className="hero-section__intro">
        <h1 className="hero-section__title">
          {t('hero.titleLine1')}<br />{t('hero.titleLine2')}<br />{t('hero.titleLine3')}
        </h1>
        <p className="hero-section__subtitle">
          {t('hero.subtitle')}
        </p>
      </div>

      <HeroBook articles={articles} onSelectArticle={onSelectArticle} />

      <div className="hero-section__about">
        <span className="hero-section__eyebrow">{t('hero.aboutLabel')}</span>
        <h2 className="hero-section__about-title">{t('hero.aboutTitle')}</h2>
        <p className="hero-section__about-copy hero-section__about-copy--spaced">
          {t('hero.aboutParagraphOne')}
        </p>
        <p className="hero-section__about-copy">
          {t('hero.aboutParagraphTwo')}
        </p>
      </div>
    </section>
  )
}
