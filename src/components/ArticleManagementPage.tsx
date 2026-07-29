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
import DeleteArticleDialog from './DeleteArticleDialog'
import type { Article } from '@/data/articles'

interface ArticleManagementPageProps {
  onWebsite: () => void
  onLogout: () => void
  onCreate: () => void
  onEdit: (id: number) => void
  onDelete: (id: number) => Promise<void>
  articles: Article[]
  loading: boolean
  error: string
}

type ArticleStatus = 'Published' | 'Draft'
type AdminArticleCategory = Article['category']

export interface AdminArticle {
  id: number
  title: string
  category: 'Cat' | 'General' | 'Inspiration'
  status: ArticleStatus
  image: string
  introduction: string
  content: string
}

// Shared by the edit route so it can hydrate the selected article form.
// eslint-disable-next-line react-refresh/only-export-components
export const adminArticles: AdminArticle[] = [
  {
    id: 1,
    title: 'Understanding Cat Behavior: Why Your Feline Friend Acts the Way They D...',
    category: 'Cat',
    status: 'Published',
    image: '/article-images/article-1.jpg',
    introduction: 'Explore the behavior and personality of cats through practical observations and research.',
    content: 'Understanding cat behavior begins with observing body language, routines, and the way cats communicate with people and their environment.',
  },
  {
    id: 2,
    title: 'The Fascinating World of Cats: Why We Love Our Furry Friends',
    category: 'Cat',
    status: 'Published',
    image: '/article-images/article-2.jpg',
    introduction: 'Cats have captivated human hearts for thousands of years. Discover the traits and quirks that make them fascinating.',
    content: '1. Independent Yet Affectionate\n\nCats balance independence and affection in a way that makes them wonderful companions.\n\n2. Playful Personalities\n\nCats are naturally curious and playful throughout their lives.\n\n3. Communication Through Body Language\n\nTheir posture, eyes, ears, and tail reveal how they feel.',
  },
  {
    id: 3,
    title: "Finding Motivation: How to Stay Inspired Through Life's Challenges",
    category: 'General',
    status: 'Published',
    image: '/article-images/article-3.jpg',
    introduction: 'Simple approaches for finding motivation and staying inspired through difficult seasons.',
    content: 'Motivation grows through small, repeatable actions. Begin with a clear goal, create a sustainable routine, and celebrate progress.',
  },
  {
    id: 4,
    title: 'The Science of the Cat’s Purr: How It Benefits Cats and Humans Alike',
    category: 'Cat',
    status: 'Published',
    image: '/article-images/article-4.jpg',
    introduction: 'A closer look at why cats purr and how the vibration may benefit cats and humans.',
    content: 'A cat’s purr communicates comfort, connection, and sometimes a need for reassurance.',
  },
  {
    id: 5,
    title: 'Top 10 Health Tips to Keep Your Cat Happy and Healthy',
    category: 'Cat',
    status: 'Published',
    image: '/article-images/article-5.jpeg',
    introduction: 'Practical health tips that support a long, comfortable, and active life for your cat.',
    content: 'Balanced nutrition, preventative veterinary care, exercise, and a safe environment form the foundation of feline health.',
  },
  {
    id: 6,
    title: 'Unlocking Creativity: Simple Habits to Spark Inspiration Daily',
    category: 'Inspiration',
    status: 'Published',
    image: '/article-images/article-6.jpg',
    introduction: 'Build a creative practice with small habits that make inspiration easier to find every day.',
    content: 'Creativity becomes more dependable when it is supported by curiosity, rest, experimentation, and consistent practice.',
  },
]

const statusOptions: Array<ArticleStatus | 'All'> = ['All', 'Published', 'Draft']
const categoryOptions: Array<AdminArticleCategory | 'All'> = ['All', 'Thinker', 'Writer', 'Literature']

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

export default function ArticleManagementPage({ onWebsite, onLogout, onCreate, onEdit, onDelete, articles, loading, error }: ArticleManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'All'>('All')
  const [categoryFilter, setCategoryFilter] = useState<AdminArticleCategory | 'All'>('All')
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
                      <span className="article-admin__status">{article.status === 'published' ? 'Published' : 'Draft'}</span>
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
            void onDelete(deleteTarget).finally(() => setDeleteTarget(null))
          }
        }}
      />
    </div>
  )
}
