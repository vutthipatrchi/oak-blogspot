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
    <section className="mb-12 grid grid-cols-1 items-center gap-8 lg:mb-20 lg:grid-cols-[minmax(190px,0.8fr)_minmax(420px,1.7fr)_minmax(190px,0.8fr)] lg:gap-9">
      <div className="flex flex-col items-start text-left lg:items-end lg:text-right">
        <h1 className="mb-6 text-[clamp(2.5rem,4.5vw,3.5rem)] leading-[1.2] font-semibold tracking-[-0.03em]">
          {t('hero.titleLine1')}<br />{t('hero.titleLine2')}<br />{t('hero.titleLine3')}
        </h1>
        <p className="max-w-none text-base leading-7 text-stone-500 lg:max-w-[300px]">
          {t('hero.subtitle')}
        </p>
      </div>

      <HeroBook articles={articles} onSelectArticle={onSelectArticle} />

      <div className="max-w-none lg:max-w-[300px]">
        <span className="mb-2 block text-xs text-stone-500">{t('hero.aboutLabel')}</span>
        <h2 className="mb-4 text-xl font-semibold">{t('hero.aboutTitle')}</h2>
        <p className="mb-4 text-sm leading-6 text-stone-500">
          {t('hero.aboutParagraphOne')}
        </p>
        <p className="text-sm leading-6 text-stone-500">
          {t('hero.aboutParagraphTwo')}
        </p>
      </div>
    </section>
  )
}
