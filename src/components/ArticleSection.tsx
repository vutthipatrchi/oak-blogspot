import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  categories,
  type Article,
  type Category,
} from '@/data/articles'

interface ArticleSectionProps {
  articles: Article[]
  onSelectArticle: (id: number) => void
}

function ArticleCard({
  article,
  onSelect,
}: {
  article: Article
  onSelect: (id: number) => void
}) {
  return (
    <article
      className="article-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(article.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(article.id)
        }
      }}
    >
      <img src={article.image} alt="" className="article-card__image" loading="lazy" />
      <div className="article-card__tags">
        <span className="article-card__tag">{article.category}</span>
        {article.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="article-card__topic">{tag}</span>
        ))}
      </div>
      <h3 className="article-card__title">{article.title}</h3>
      <p className="article-card__excerpt">{article.excerpt}</p>
      <div className="article-card__meta">
        <img src={article.authorAvatar} alt="" className="article-card__avatar" />
        <span className="article-card__author">{article.author}</span>
        <span className="article-card__date">{article.date}</span>
      </div>
    </article>
  )
}

export default function ArticleSection({ articles, onSelectArticle }: ArticleSectionProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('Highlight')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'Highlight' || article.category === activeCategory
      const searchableText = [
        article.title,
        article.excerpt,
        article.category,
        ...article.tags,
        article.author,
        ...article.sections.flatMap((section) => [
          section.title,
          ...section.paragraphs,
          ...(section.bullets?.flatMap((bullet) => [bullet.term, bullet.description]) ?? []),
        ]),
      ].join(' ').toLowerCase()

      return matchesCategory && (query === '' || searchableText.includes(query))
    })
  }, [activeCategory, articles, searchQuery])

  const searchSuggestions = searchQuery.trim() ? filteredArticles.slice(0, 3) : []

  return (
    <section className="articles-section" id="articles">
      <h2 className="articles-section__title">Latest articles</h2>

      <div className="articles-toolbar">
        <div className="articles-toolbar__filters hidden md:flex">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn${activeCategory === category ? ' filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="w-full md:hidden">
          <Select
            value={activeCategory}
            onValueChange={(value) => value && setActiveCategory(value as Category)}
          >
            <SelectTrigger className="h-12 w-full rounded-xl bg-white px-4" aria-label="Article category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="search-box"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setSearchFocused(false)
              setActiveSuggestionIndex(-1)
            }
          }}
        >
          <label htmlFor="article-search" className="visually-hidden">Search articles</label>
          <Input
            id="article-search"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setSearchFocused(true)
              setActiveSuggestionIndex(-1)
            }}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && searchSuggestions.length > 0) {
                event.preventDefault()
                setActiveSuggestionIndex((current) =>
                  current < searchSuggestions.length - 1 ? current + 1 : 0,
                )
              } else if (event.key === 'ArrowUp' && searchSuggestions.length > 0) {
                event.preventDefault()
                setActiveSuggestionIndex((current) =>
                  current > 0 ? current - 1 : searchSuggestions.length - 1,
                )
              } else if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
                event.preventDefault()
                onSelectArticle(searchSuggestions[activeSuggestionIndex].id)
              } else if (event.key === 'Escape') {
                setSearchQuery('')
                setSearchFocused(false)
                setActiveSuggestionIndex(-1)
              }
            }}
            aria-controls="search-results articles-grid"
            aria-expanded={searchFocused && searchQuery.trim() !== ''}
            aria-autocomplete="list"
            aria-activedescendant={
              activeSuggestionIndex >= 0
                ? `search-result-${searchSuggestions[activeSuggestionIndex].id}`
                : undefined
            }
            autoComplete="off"
            className="search-box__input"
          />
          <span className="search-box__icon">
            <Search className="size-4" aria-hidden="true" />
          </span>

          {searchFocused && searchQuery.trim() !== '' && (
            <div className="search-results" id="search-results" role="listbox">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((article, index) => (
                  <button
                    key={article.id}
                    id={`search-result-${article.id}`}
                    type="button"
                    role="option"
                    aria-selected={activeSuggestionIndex === index}
                    className={`search-results__item${activeSuggestionIndex === index ? ' search-results__item--active' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onSelectArticle(article.id)}
                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                  >
                    {article.title}
                  </button>
                ))
              ) : (
                <p className="search-results__empty">No matching articles</p>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">
        {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'} found
      </p>

      <div className="articles-grid" id="articles-grid">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} onSelect={onSelectArticle} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <p className="articles-empty">
          No articles found{searchQuery.trim() ? ` for “${searchQuery.trim()}”` : ''}.
        </p>
      )}

      <div className="view-more">
        <a href="#articles" className="view-more__link">View more</a>
      </div>
    </section>
  )
}
