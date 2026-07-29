import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Bell, BookOpen, ExternalLink, Folder, LogOut, RotateCcw, Trash2, User } from 'lucide-react'
import type { Article } from '@/data/articles'
import type { ArticleWriteInput } from '@/lib/articles'
import DeleteArticleDialog from './DeleteArticleDialog'

interface EditArticlePageProps {
  article: Article
  onArticles: () => void
  onWebsite: () => void
  onLogout: () => void
  onDelete: () => Promise<void>
  onSave: (article: ArticleWriteInput) => Promise<void>
}

export default function EditArticlePage({ article, onArticles, onWebsite, onLogout, onDelete, onSave }: EditArticlePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = useState(article.image)
  const [showDelete, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const handleThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { if (typeof reader.result === 'string') setThumbnail(reader.result) }
    reader.readAsDataURL(file)
  }

  const save = async (event: FormEvent<HTMLFormElement>, status: 'draft' | 'published') => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSaving(true)
    setMessage('')
    try {
      await onSave({
        category: form.get('category') as ArticleWriteInput['category'],
        title: String(form.get('title') ?? ''),
        excerpt: String(form.get('introduction') ?? ''),
        image: thumbnail,
        author: article.author || 'Thompson P.',
        status,
        sections: [{ title: '', paragraphs: [String(form.get('content') ?? '')] }],
      })
      setMessage(status === 'draft' ? 'Changes saved as draft.' : 'Article changes saved.')
      onArticles()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update article.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar" aria-label="Admin navigation">
        <div>
          <button type="button" className="admin-shell__brand" onClick={onWebsite}>hh<span>.</span></button>
          <p className="admin-shell__eyebrow">Admin panel</p>
          <nav className="admin-shell__nav">
            <button type="button" className="admin-shell__nav-item admin-shell__nav-item--active" onClick={onArticles}><BookOpen size={20} strokeWidth={1.6} /><span>Article management</span></button>
            <button type="button" className="admin-shell__nav-item"><Folder size={20} strokeWidth={1.6} /><span>Category management</span></button>
            <button type="button" className="admin-shell__nav-item"><User size={20} strokeWidth={1.6} /><span>Profile</span></button>
            <button type="button" className="admin-shell__nav-item"><Bell size={20} strokeWidth={1.6} /><span>Notification</span></button>
            <button type="button" className="admin-shell__nav-item"><RotateCcw size={20} strokeWidth={1.6} /><span>Reset password</span></button>
          </nav>
        </div>
        <div className="admin-shell__footer">
          <button type="button" className="admin-shell__footer-btn" onClick={onWebsite}><ExternalLink size={19} strokeWidth={1.6} /><span>hh. website</span></button>
          <button type="button" className="admin-shell__footer-btn" onClick={onLogout}><LogOut size={19} strokeWidth={1.6} /><span>Log out</span></button>
        </div>
      </aside>

      <main className="create-article">
        <header className="create-article__header">
          <h1>Edit article</h1>
          <div className="create-article__header-actions">
            <button disabled={saving} type="submit" form="edit-article-form" value="draft" className="create-article__draft">Save as draft</button>
            <button disabled={saving} type="submit" form="edit-article-form" value="published" className="create-article__publish">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </header>

        <form
          id="edit-article-form"
          className="create-article__form"
          onSubmit={(event) => {
            const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
            void save(event, submitter?.value === 'draft' ? 'draft' : 'published')
          }}
        >
          <section className="create-article__thumbnail-section">
            <span className="create-article__label">Thumbnail image</span>
            <div className="create-article__thumbnail-row">
              <div className="create-article__thumbnail"><img src={thumbnail} alt="Thumbnail preview" /></div>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleThumbnail} className="visually-hidden" />
              <button type="button" className="create-article__upload" onClick={() => fileInputRef.current?.click()}>Upload thumbnail image</button>
            </div>
          </section>

          <label className="create-article__field create-article__field--short">
            <span>Category</span>
            <select name="category" defaultValue={article.category} required>
              <option value="Thinker">Thinker</option><option value="Writer">Writer</option><option value="Literature">Literature</option>
            </select>
          </label>
          <label className="create-article__field create-article__field--short create-article__field--disabled"><span>Author name</span><input value="Thompson P." disabled /></label>
          <label className="create-article__field"><span>Title</span><input name="title" defaultValue={article.title} required /></label>
          <label className="create-article__field"><span>Introduction (max 120 letters)</span><textarea name="introduction" defaultValue={article.excerpt} maxLength={120} rows={5} required /></label>
          <label className="create-article__field"><span>Content</span><textarea name="content" defaultValue={article.sections.flatMap((section) => section.paragraphs).join('\n\n')} className="create-article__content-input" required /></label>

          <button type="button" className="edit-article__delete" onClick={() => setShowDelete(true)}><Trash2 size={20} strokeWidth={1.6} /><span>Delete article</span></button>
          {message && <p className="create-article__message" role="status">{message}</p>}
        </form>
      </main>

      <DeleteArticleDialog open={showDelete} onCancel={() => setShowDelete(false)} onConfirm={onDelete} />
    </div>
  )
}
