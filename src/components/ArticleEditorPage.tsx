import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Image, Trash2 } from 'lucide-react'
import type { Article, ArticleCategory } from '@/data/articles'
import type { MemberProfile } from '@/data/member'
import { uploadArticleImage, type ArticleWriteInput } from '@/lib/articles'
import AdminLayout from './AdminLayout'
import DeleteArticleDialog from './DeleteArticleDialog'
import { useToast } from './ui/use-toast'

interface SharedProps {
  author: MemberProfile
  categories: ArticleCategory[]
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
  const { mode, author, categories, onArticles, onWebsite, onLogout, onSave } = props
  const article = mode === 'edit' ? props.article : null
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [thumbnail, setThumbnail] = useState(article?.imagePath ?? article?.image ?? '')
  const [thumbnailPreview, setThumbnailPreview] = useState(article?.image ?? '')
  const [showDelete, setShowDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleThumbnail = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please select a JPEG, PNG, or WebP image.')
      event.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('The image must not exceed 5 MB.')
      event.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setThumbnailPreview(objectUrl)
    setUploading(true)
    try {
      const uploaded = await uploadArticleImage(file)
      setThumbnail(uploaded.path)
      setThumbnailPreview(uploaded.url)
      toast.success('Thumbnail uploaded successfully.')
    } catch (uploadError) {
      setThumbnailPreview(thumbnail)
      toast.error(uploadError instanceof Error ? uploadError.message : 'Unable to upload image.')
    } finally {
      URL.revokeObjectURL(objectUrl)
      setUploading(false)
      event.target.value = ''
    }
  }

  const save = async (event: FormEvent<HTMLFormElement>, status: ArticleWriteInput['status']) => {
    event.preventDefault()
    if (uploading) {
      toast.info('Please wait for the image upload to finish.')
      return
    }
    const form = new FormData(event.currentTarget)
    setSaving(true)

    try {
      await onSave({
        categoryId: Number(form.get('categoryId')),
        title: String(form.get('title') ?? ''),
        excerpt: String(form.get('introduction') ?? ''),
        image: thumbnail,
        status,
        sections: [{ title: '', paragraphs: [String(form.get('content') ?? '')] }],
      })
      toast.success(status === 'draft' ? 'Article saved as draft.' : 'Article saved successfully.')
      onArticles()
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : 'Unable to save article.')
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
              disabled={saving || uploading}
              type="submit"
              form="article-editor-form"
              value="draft"
              className="create-article__draft"
            >
              Save as draft
            </button>
            <button
              disabled={saving || uploading}
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
                {thumbnailPreview
                  ? <img src={thumbnailPreview} alt="Thumbnail preview" />
                  : <Image size={34} strokeWidth={1.3} aria-hidden="true" />}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => { void handleThumbnail(event) }}
                className="visually-hidden"
              />
              <button
                type="button"
                className="create-article__upload"
                disabled={uploading || saving}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Uploading...' : 'Upload thumbnail image'}
              </button>
            </div>
          </section>

          <label className="create-article__field create-article__field--short">
            <span>Category</span>
            <select
              key={categories.map((category) => category.id).join('-')}
              name="categoryId"
              defaultValue={article?.categoryId?.toString()
                ?? categories.find((category) => category.name === article?.category)?.id.toString()
                ?? ''}
              required
              disabled={categories.length === 0}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label className="create-article__field create-article__field--short create-article__field--disabled">
            <span>Author name</span>
            <input value={author.name || author.username || author.email} disabled />
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
