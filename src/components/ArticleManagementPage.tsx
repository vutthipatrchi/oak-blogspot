import { useMemo, useState } from 'react'
import {
  ChevronDown,
  Edit2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import DeleteArticleDialog from './DeleteArticleDialog'
import AdminLayout from './AdminLayout'
import type { Article, ArticleCategory } from '@/data/articles'
import { useToast } from './ui/use-toast'

interface ArticleManagementPageProps {
  onWebsite: () => void
  onLogout: () => void
  onCreate: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => Promise<void>
  articles: Article[]
  categories: ArticleCategory[]
  loading: boolean
  error: string
  onOpenArticle: (articleId: number) => void
}

type ArticleStatus = 'Published' | 'Draft'
const statusOptions: Array<ArticleStatus | 'All'> = ['All', 'Published', 'Draft']

export default function ArticleManagementPage({ onWebsite, onLogout, onCreate, onEdit, onDelete, articles, categories, loading, error, onOpenArticle }: ArticleManagementPageProps) {
  const toast = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return articles.filter((article) => {
      const articleStatus: ArticleStatus = article.status === 'published' ? 'Published' : 'Draft'
      const matchesQuery =
        query === '' ||
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        articleStatus.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'All' || articleStatus === statusFilter
      const matchesCategory = categoryFilter === 'All' || article.category === categoryFilter

      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [articles, categoryFilter, searchQuery, statusFilter])

  return (
    <AdminLayout onWebsite={onWebsite} onLogout={onLogout} onOpenArticle={onOpenArticle}>
      <main className="article-admin">
        <header className="article-admin__header">
          <h1>Article management</h1>
          <button type="button" className="article-admin__create" onClick={onCreate}>
            <Plus size={18} strokeWidth={1.8} />
            <span>Create article</span>
          </button>
        </header>

        <section className="article-admin__content" aria-label="Article list">
          {error && <p className="create-article__message" role="alert">{error}</p>}
          {loading && <p className="article-admin__empty" role="status">Loading articles...</p>}
          <div className="article-admin__toolbar">
            <label className="article-admin__search">
              <Search size={20} strokeWidth={1.6} aria-hidden="true" />
              <span className="visually-hidden">Search articles</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
                type="search"
              />
            </label>

            <div className="article-admin__filters">
              <label className="article-admin__select">
                <span className="visually-hidden">Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as ArticleStatus | 'All')}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'Status' : status}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.7} aria-hidden="true" />
              </label>

              <label className="article-admin__select">
                <span className="visually-hidden">Category</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="All">Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.7} aria-hidden="true" />
              </label>
            </div>
          </div>

          <div className="article-admin__table-wrap">
            <table className="article-admin__table">
              <thead>
                <tr>
                  <th scope="col">Article title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td>
                      <span className="article-admin__title">{article.title}</span>
                    </td>
                    <td>{article.category}</td>
                    <td>
                      <span className={`article-admin__status${article.status === 'published' ? '' : ' article-admin__status--draft'}`}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="article-admin__actions">
                        <button type="button" aria-label={`Edit ${article.title}`} onClick={() => onEdit(article.id)}>
                          <Edit2 size={18} strokeWidth={1.8} />
                        </button>
                        <button type="button" aria-label={`Delete ${article.title}`} onClick={() => setDeleteTarget(article.id)}>
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredArticles.length === 0 && (
              <p className="article-admin__empty" role="status">
                No articles found.
              </p>
            )}
          </div>
        </section>
      </main>
      <DeleteArticleDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget !== null) {
            const article = articles.find((item) => item.id === deleteTarget)
            void onDelete(deleteTarget)
              .then(() => toast.success(article ? `Deleted “${article.title}”.` : 'Article deleted.'))
              .catch((deleteError) => {
                toast.error(deleteError instanceof Error ? deleteError.message : 'Unable to delete article.')
              })
              .finally(() => setDeleteTarget(null))
          }
        }}
      />
    </AdminLayout>
  )
}
