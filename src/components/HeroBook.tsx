import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Article } from '../data/articles'

interface HeroBookProps {
  articles: Article[]
  onSelectArticle: (id: number) => void
}

export default function HeroBook({ articles, onSelectArticle }: HeroBookProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [spreadIndex, setSpreadIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const totalSpreads = Math.ceil(articles.length / 2)
  const firstPageIndex = spreadIndex * 2
  const visibleArticles = articles.slice(firstPageIndex, firstPageIndex + 2)

  const turnPage = (nextIndex: number) => {
    setDirection(nextIndex > spreadIndex ? 'next' : 'previous')
    setSpreadIndex(nextIndex)
  }

  if (!isOpen) {
    return (
      <div className="hero-book hero-book--closed">
        <button type="button" className="hero-book__cover" onClick={() => setIsOpen(true)}>
          <span className="hero-book__cover-kicker">{t('hero.bookKicker')}</span>
          <strong>{t('hero.bookTitleLine1')}<br />{t('hero.bookTitleLine2')}</strong>
          <span className="hero-book__cover-line" />
          <span className="hero-book__cover-action">{t('hero.bookAction')}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="hero-book hero-book--open">
      <div className={`hero-book__spread hero-book__spread--${direction}`} key={spreadIndex}>
        {visibleArticles.map((article, index) => (
          <button
            key={article.id}
            type="button"
            className={`hero-book__page hero-book__page--${index === 0 ? 'left' : 'right'}`}
            onClick={() => onSelectArticle(article.id)}
            aria-label={t('hero.openArticle', { title: article.title })}
          >
            <img src={article.image} alt="" />
            <span className="hero-book__page-number">{firstPageIndex + index + 1}</span>
            <span className="hero-book__page-title">{article.title}</span>
          </button>
        ))}
      </div>

      <div className="hero-book__controls">
        <button
          type="button"
          onClick={() => turnPage(spreadIndex - 1)}
          disabled={spreadIndex === 0}
          aria-label={t('hero.previousPage')}
        >
          ←
        </button>
        <span>
          {t('hero.pageRange', {
            start: firstPageIndex + 1,
            end: Math.min(firstPageIndex + 2, articles.length),
            total: articles.length,
          })}
        </span>
        <button
          type="button"
          onClick={() => turnPage(spreadIndex + 1)}
          disabled={spreadIndex >= totalSpreads - 1}
          aria-label={t('hero.nextPage')}
        >
          →
        </button>
        <button type="button" className="hero-book__close" onClick={() => setIsOpen(false)}>
          {t('hero.closeBook')}
        </button>
      </div>
    </div>
  )
}
