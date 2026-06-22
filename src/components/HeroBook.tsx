import { useState } from 'react'
import type { Article } from '../data/articles'

interface HeroBookProps {
  articles: Article[]
  onSelectArticle: (id: number) => void
}

export default function HeroBook({ articles, onSelectArticle }: HeroBookProps) {
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
          <span className="hero-book__cover-kicker">A CURATED ARCHIVE</span>
          <strong>THINKERS<br />&amp; WRITERS</strong>
          <span className="hero-book__cover-line" />
          <span className="hero-book__cover-action">เปิดหนังสือ</span>
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
            aria-label={`เปิดบทความ ${article.title}`}
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
          aria-label="หน้าก่อนหน้า"
        >
          ←
        </button>
        <span>หน้า {firstPageIndex + 1}–{Math.min(firstPageIndex + 2, articles.length)} / {articles.length}</span>
        <button
          type="button"
          onClick={() => turnPage(spreadIndex + 1)}
          disabled={spreadIndex >= totalSpreads - 1}
          aria-label="หน้าถัดไป"
        >
          →
        </button>
        <button type="button" className="hero-book__close" onClick={() => setIsOpen(false)}>
          ปิด
        </button>
      </div>
    </div>
  )
}
