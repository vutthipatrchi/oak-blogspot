import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { AvatarImage } from '@/components/ui/AvatarImage'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type Article,
  type ArticleCategory,
} from '@/data/articles'
import { fetchArticlePage, hasBackendApi } from '@/lib/articles'

interface ArticleSectionProps {
  articles: Article[]
  categories: ArticleCategory[]
  loading: boolean
  onSelectArticle: (id: number) => void
}

const ARTICLES_PER_PAGE = 6

function ArticleCard({
  article,
  onSelect,
}: {
  article: Article
  onSelect: (id: number) => void
}) {
  const { t } = useTranslation()

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
        <span className="article-card__tag">{t(`articles.categories.${article.category}`, { defaultValue: article.category })}</span>
        {article.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="article-card__topic">{tag}</span>
        ))}
      </div>
      <h3 className="article-card__title">{article.title}</h3>
      <p className="article-card__excerpt">{article.excerpt}</p>
      <div className="article-card__meta">
        <AvatarImage src={article.authorAvatar} alt="" className="article-card__avatar" />
        <span className="article-card__author">{article.author}</span>
        <span className="article-card__date">{article.date}</span>
      </div>
    </article>
  )
}

export default function ArticleSection({ articles, categories, loading, onSelectArticle }: ArticleSectionProps) {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('Highlight')
  const categoryNames = useMemo(
    () => ['Highlight', ...(categories.length > 0
      ? categories.map((category) => category.name)
      : [...new Set(articles.map((article) => article.category))])],
    [articles, categories],
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [visibleArticleCount, setVisibleArticleCount] = useState(ARTICLES_PER_PAGE)
  const [pagedArticles, setPagedArticles] = useState<Article[]>(
    () => hasBackendApi ? [] : articles.filter((article) => article.status === 'published').slice(0, ARTICLES_PER_PAGE),
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loadingPage, setLoadingPage] = useState(hasBackendApi)
  const [loadingMore, setLoadingMore] = useState(false)
  const requestIdRef = useRef(0)

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'Highlight' || article.category === activeCategory
      const searchableText = [
        article.title,
        article.excerpt,
        article.category,
        t(`articles.categories.${article.category}`, { defaultValue: article.category }),
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
  }, [activeCategory, articles, searchQuery, t])

  const searchSuggestions = searchQuery.trim() ? filteredArticles.slice(0, 3) : []
  const visibleArticles = hasBackendApi
    ? pagedArticles
    : filteredArticles.slice(0, visibleArticleCount)
  const hasMoreArticles = hasBackendApi
    ? hasNextPage
    : visibleArticles.length < filteredArticles.length

  useEffect(() => {
    if (!hasBackendApi || loading) return

    const requestId = ++requestIdRef.current
    const timer = window.setTimeout(() => {
      setLoadingPage(true)
      setLoadingMore(false)
      fetchArticlePage({
        page: 1,
        limit: ARTICLES_PER_PAGE,
        status: 'published',
        category: activeCategory === 'Highlight' ? undefined : activeCategory,
        search: searchQuery.trim() || undefined,
      })
        .then((result) => {
          if (requestId !== requestIdRef.current) return
          setPagedArticles(result.articles)
          setCurrentPage(1)
          setHasNextPage(result.pagination.hasMore)
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return
          const fallbackArticles = filteredArticles.slice(0, ARTICLES_PER_PAGE)
          setPagedArticles(fallbackArticles)
          setCurrentPage(1)
          setHasNextPage(filteredArticles.length > fallbackArticles.length)
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setLoadingPage(false)
        })
    }, searchQuery.trim() ? 300 : 0)

    return () => window.clearTimeout(timer)
  }, [activeCategory, filteredArticles, loading, searchQuery])

  const loadMoreArticles = async () => {
    if (!hasBackendApi) {
      setVisibleArticleCount((current) => current + ARTICLES_PER_PAGE)
      return
    }
    if (loadingPage || loadingMore || !hasNextPage) return

    const nextPage = currentPage + 1
    const requestId = ++requestIdRef.current
    setLoadingMore(true)
    try {
      const result = await fetchArticlePage({
        page: nextPage,
        limit: ARTICLES_PER_PAGE,
        status: 'published',
        category: activeCategory === 'Highlight' ? undefined : activeCategory,
        search: searchQuery.trim() || undefined,
      })
      if (requestId !== requestIdRef.current) return
      setPagedArticles((current) => [
        ...current,
        ...result.articles.filter((article) => !current.some((item) => item.id === article.id)),
      ])
      setCurrentPage(nextPage)
      setHasNextPage(result.pagination.hasMore)
    } catch {
      if (requestId === requestIdRef.current) setHasNextPage(true)
    } finally {
      if (requestId === requestIdRef.current) setLoadingMore(false)
    }
  }

  const selectCategory = (category: string) => {
    setActiveCategory(category)
    if (hasBackendApi) setLoadingPage(true)
    setVisibleArticleCount(ARTICLES_PER_PAGE)
    setHasNextPage(false)
  }

  return (
    <section className="articles-section" id="articles">
      <h2 className="articles-section__title">{t('articles.latest')}</h2>

      <div className="articles-toolbar">
        <div className="articles-toolbar__filters hidden md:flex">
          {categoryNames.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn${activeCategory === category ? ' filter-btn--active' : ''}`}
              onClick={() => selectCategory(category)}
            >
              {t(`articles.categories.${category}`, { defaultValue: category })}
            </button>
          ))}
        </div>

        <div className="w-full md:hidden">
          <Select
            value={activeCategory}
            onValueChange={(value) => value && selectCategory(value)}
          >
            <SelectTrigger className="h-12 w-full rounded-xl bg-white px-4" aria-label={t('articles.categoryLabel')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryNames.map((category) => (
                <SelectItem key={category} value={category}>{t(`articles.categories.${category}`, { defaultValue: category })}</SelectItem>
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
          <label htmlFor="article-search" className="visually-hidden">{t('articles.searchLabel')}</label>
          <Input
            id="article-search"
            type="search"
            placeholder={t('articles.searchPlaceholder')}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              if (hasBackendApi) setLoadingPage(true)
              setVisibleArticleCount(ARTICLES_PER_PAGE)
              setHasNextPage(false)
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
                if (hasBackendApi) setLoadingPage(true)
                setVisibleArticleCount(ARTICLES_PER_PAGE)
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
                <p className="search-results__empty">{t('articles.noMatching')}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {!loading && !loadingPage && (
        <p className="visually-hidden" role="status" aria-live="polite">
          {t('articles.resultsStatus', { count: hasBackendApi ? visibleArticles.length : filteredArticles.length })}
        </p>
      )}

      {loading || loadingPage ? (
        <div className="articles-loading" id="articles-grid" role="status">
          <span className="articles-loading__spinner" aria-hidden="true" />
          <span>{t('articles.loading')}</span>
        </div>
      ) : <div className="articles-grid" id="articles-grid">
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} onSelect={onSelectArticle} />
        ))}
      </div>}

      {!loading && !loadingPage && visibleArticles.length === 0 && (
        <p className="articles-empty">
          {searchQuery.trim()
            ? t('articles.emptyWithQuery', { query: searchQuery.trim() })
            : t('articles.empty')}
        </p>
      )}

      {!loading && !loadingPage && hasMoreArticles && (
        <div className="view-more">
          <button
            type="button"
            className="view-more__link"
            disabled={loadingMore}
            onClick={() => { void loadMoreArticles() }}
          >
            {loadingMore ? t('articles.loading') : t('articles.viewMore')}
          </button>
        </div>
      )}
    </section>
  )
}
