import { useMemo, useState, type ReactNode } from 'react'
import {
  Bell,
  BookOpen,
  ChevronDown,
  Edit2,
  ExternalLink,
  Folder,
  LogOut,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  User,
} from 'lucide-react'

interface ArticleManagementPageProps {
  onWebsite: () => void
  onLogout: () => void
}

type ArticleStatus = 'Published' | 'Draft'
type AdminArticleCategory = 'Cat' | 'General' | 'Inspiration'

interface AdminArticle {
  id: number
  title: string
  category: AdminArticleCategory
  status: ArticleStatus
}

const adminArticles: AdminArticle[] = [
  {
    id: 1,
    title: 'Understanding Cat Behavior: Why Your Feline Friend Acts the Way They D...',
    category: 'Cat',
    status: 'Published',
  },
  {
    id: 2,
    title: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    category: 'Cat',
    status: 'Published',
  },
  {
    id: 3,
    title: "Finding Motivation: How to Stay Inspired Through Life's Challenges",
    category: 'General',
    status: 'Published',
  },
  {
    id: 4,
    title: 'The Science of the Cat’s Purr: How It Benefits Cats and Humans Alike',
    category: 'Cat',
    status: 'Published',
  },
  {
    id: 5,
    title: 'Top 10 Health Tips to Keep Your Cat Happy and Healthy',
    category: 'Cat',
    status: 'Published',
  },
  {
    id: 6,
    title: 'Unlocking Creativity: Simple Habits to Spark Inspiration Daily',
    category: 'Inspiration',
    status: 'Published',
  },
]

const statusOptions: Array<ArticleStatus | 'All'> = ['All', 'Published', 'Draft']
const categoryOptions: Array<AdminArticleCategory | 'All'> = ['All', 'Cat', 'General', 'Inspiration']

function SidebarButton({
  active = false,
  icon,
  label,
}: {
  active?: boolean
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      className={`admin-shell__nav-item${active ? ' admin-shell__nav-item--active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export default function ArticleManagementPage({ onWebsite, onLogout }: ArticleManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<AdminArticleCategory | 'All'>('All')

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return adminArticles.filter((article) => {
      const matchesQuery =
        query === '' ||
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.status.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'All' || article.status === statusFilter
      const matchesCategory = categoryFilter === 'All' || article.category === categoryFilter

      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [categoryFilter, searchQuery, statusFilter])

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar" aria-label="Admin navigation">
        <div>
          <button type="button" className="admin-shell__brand" onClick={onWebsite}>
            hh<span>.</span>
          </button>
          <p className="admin-shell__eyebrow">Admin panel</p>
        </div>

        <nav className="admin-shell__nav">
          <SidebarButton active icon={<BookOpen size={20} strokeWidth={1.6} />} label="Article management" />
          <SidebarButton icon={<Folder size={20} strokeWidth={1.6} />} label="Category management" />
          <SidebarButton icon={<User size={20} strokeWidth={1.6} />} label="Profile" />
          <SidebarButton icon={<Bell size={20} strokeWidth={1.6} />} label="Notification" />
          <SidebarButton icon={<RotateCcw size={20} strokeWidth={1.6} />} label="Reset password" />
        </nav>

        <div className="admin-shell__footer">
          <button type="button" className="admin-shell__footer-btn" onClick={onWebsite}>
            <ExternalLink size={19} strokeWidth={1.6} />
            <span>hh. website</span>
          </button>
          <button type="button" className="admin-shell__footer-btn" onClick={onLogout}>
            <LogOut size={19} strokeWidth={1.6} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="article-admin">
        <header className="article-admin__header">
          <h1>Article management</h1>
          <button type="button" className="article-admin__create">
            <Plus size={18} strokeWidth={1.8} />
            <span>Create article</span>
          </button>
        </header>

        <section className="article-admin__content" aria-label="Article list">
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
                  onChange={(event) => setCategoryFilter(event.target.value as AdminArticleCategory | 'All')}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'Category' : category}
                    </option>
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
                      <span className="article-admin__status">Published</span>
                    </td>
                    <td>
                      <div className="article-admin__actions">
                        <button type="button" aria-label={`Edit ${article.title}`}>
                          <Edit2 size={18} strokeWidth={1.8} />
                        </button>
                        <button type="button" aria-label={`Delete ${article.title}`}>
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
    </div>
  )
}
