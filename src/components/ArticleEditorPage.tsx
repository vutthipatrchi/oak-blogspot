import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Image, Trash2 } from 'lucide-react'
import type { Article } from '@/data/articles'
import type { ArticleWriteInput } from '@/lib/articles'
import AdminLayout from './AdminLayout'
import DeleteArticleDialog from './DeleteArticleDialog'

const defaultAuthor = 'Thompson P.'

interface SharedProps {
  onArticles: () => void
  onWebsite: () => void
  onLogout: () => void
  onSave: (article: ArticleWriteInput) => Promise<void>
}

type ArticleEditorPageProps = SharedProps & (
  | {
      mode: 'create'
      article?: never
      onDelete?: never
    }
  | {
      mode: 'edit'
      article: Article
      onDelete: () => Promise<void>
    }
)

export default function ArticleEditorPage(props: ArticleEditorPageProps) {
  const { mode, onArticles, onWebsite, onLogout, onSave } = props
  const article = mode === 'edit' ? props.article : null
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = useState(article?.image ?? '')
  const [showDelete, setShowDelete] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleThumbnail = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setThumbnail(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const save = async (event: FormEvent<HTMLFormElement>, status: ArticleWriteInput['status']) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSaving(true)
    setError('')

    try {
      await onSave({
        category: form.get('category') as ArticleWriteInput['category'],
        title: String(form.get('title') ?? ''),
        excerpt: String(form.get('introduction') ?? ''),
        image: thumbnail,
        author: article?.author || defaultAuthor,
        status,
        sections: [{ title: '', paragraphs: [String(form.get('content') ?? '')] }],
      })
      onArticles()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save article.')
    } finally {
      setSaving(false)
    }
  }

  const content = article?.sections
    .flatMap((section) => section.paragraphs)
    .join('\n\n') ?? ''

  return (
    <AdminLayout onArticles={onArticles} onWebsite={onWebsite} onLogout={onLogout}>
      <main className="create-article">
        <header className="create-article__header">
          <h1>{mode === 'create' ? 'Create article' : 'Edit article'}</h1>
          <div className="create-article__header-actions">
            <button
              disabled={saving}
              type="submit"
              form="article-editor-form"
              value="draft"
              className="create-article__draft"
            >
              Save as draft
            </button>
            <button
              disabled={saving}
              type="submit"
              form="article-editor-form"
              value="published"
              className="create-article__publish"
            >
              {saving ? 'Saving...' : mode === 'create' ? 'Save and publish' : 'Save'}
            </button>
          </div>
        </header>

        <form
          id="article-editor-form"
          className="create-article__form"
          onSubmit={(event) => {
            const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
            void save(event, submitter?.value === 'draft' ? 'draft' : 'published')
          }}
        >
          <section className="create-article__thumbnail-section">
            <span className="create-article__label">Thumbnail image</span>
            <div className="create-article__thumbnail-row">
              <div className="create-article__thumbnail">
                {thumbnail
                  ? <img src={thumbnail} alt="Thumbnail preview" />
                  : <Image size={34} strokeWidth={1.3} aria-hidden="true" />}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleThumbnail}
                className="visually-hidden"
              />
              <button
                type="button"
                className="create-article__upload"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload thumbnail image
              </button>
            </div>
          </section>

          <label className="create-article__field create-article__field--short">
            <span>Category</span>
            <select name="category" defaultValue={article?.category ?? ''} required>
              <option value="" disabled>Select category</option>
              <option value="Thinker">Thinker</option>
              <option value="Writer">Writer</option>
              <option value="Literature">Literature</option>
            </select>
          </label>

          <label className="create-article__field create-article__field--short create-article__field--disabled">
            <span>Author name</span>
            <input value={article?.author || defaultAuthor} disabled />
          </label>

          <label className="create-article__field">
            <span>Title</span>
            <input name="title" defaultValue={article?.title ?? ''} placeholder="Article title" required />
          </label>

          <label className="create-article__field">
            <span>Introduction (max 120 letters)</span>
            <textarea
              name="introduction"
              defaultValue={article?.excerpt ?? ''}
              placeholder="Introduction"
              maxLength={120}
              rows={5}
              required
            />
          </label>

          <label className="create-article__field">
            <span>Content</span>
            <textarea
              name="content"
              defaultValue={content}
              placeholder="Content"
              className="create-article__content-input"
              required
            />
          </label>

          {mode === 'edit' && (
            <button
              type="button"
              className="edit-article__delete"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 size={20} strokeWidth={1.6} />
              <span>Delete article</span>
            </button>
          )}
          {error && <p className="create-article__message" role="alert">{error}</p>}
        </form>
      </main>

      {mode === 'edit' && (
        <DeleteArticleDialog
          open={showDelete}
          onCancel={() => setShowDelete(false)}
          onConfirm={props.onDelete}
        />
      )}
    </AdminLayout>
  )
}
