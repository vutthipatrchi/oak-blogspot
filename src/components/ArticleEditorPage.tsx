import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Image, Plus, Trash2, X } from 'lucide-react'
import type { Article, ArticleCategory, ArticleSection } from '@/data/articles'
import type { MemberProfile } from '@/data/member'
import { articleSectionsFromForm } from '@/lib/articleContent'
import { uploadArticleImage, type ArticleWriteInput } from '@/lib/articles'
import AdminLayout from './AdminLayout'
import DeleteArticleDialog from './DeleteArticleDialog'
import { useToast } from './ui/use-toast'

const MAX_TAGS = 10
const MAX_TAG_LENGTH = 40

function mergeTags(currentTags: string[], input: string): string[] {
  const nextTags = [...currentTags]
  const existingTags = new Set(currentTags.map((tag) => tag.toLocaleLowerCase()))

  for (const candidate of input.split(',')) {
    const tag = candidate.trim().replace(/\s+/g, ' ')
    const normalizedTag = tag.toLocaleLowerCase()
    if (!tag || existingTags.has(normalizedTag)) continue
    nextTags.push(tag)
    existingTags.add(normalizedTag)
  }

  return nextTags
}

interface SharedProps {
  author: MemberProfile
  categories: ArticleCategory[]
  onArticles: () => void
  onWebsite: () => void
  onLogout: () => void
  onSave: (article: ArticleWriteInput) => Promise<void>
  onCreateCategory: (name: string) => Promise<ArticleCategory>
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

interface EditableSection {
  key: string
  section: ArticleSection
  bulletKeys: string[]
}

export default function ArticleEditorPage(props: ArticleEditorPageProps) {
  const { mode, author, categories, onArticles, onWebsite, onLogout, onSave, onCreateCategory } = props
  const article = mode === 'edit' ? props.article : null
  const initialSections = article?.sections.length
    ? article.sections
    : [{ title: '', paragraphs: [] }]
  const nextSectionKey = useRef(initialSections.length)
  const nextBulletKey = useRef(initialSections.reduce(
    (count, section) => count + (section.bullets?.length ?? 0),
    0,
  ))
  const [editableSections, setEditableSections] = useState<EditableSection[]>(() => initialSections.map(
    (section, sectionIndex) => ({
      key: `section-${sectionIndex}`,
      section,
      bulletKeys: (section.bullets ?? []).map((_bullet, bulletIndex) => `bullet-${sectionIndex}-${bulletIndex}`),
    }),
  ))
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const [thumbnail, setThumbnail] = useState(article?.imagePath ?? article?.image ?? '')
  const [thumbnailPreview, setThumbnailPreview] = useState(article?.image ?? '')
  const [showDelete, setShowDelete] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tags, setTags] = useState(article?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const initialCategoryId = article?.categoryId?.toString()
    ?? categories.find((category) => category.name === article?.category)?.id.toString()
    ?? ''
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)
  const selectedCategoryId = categoryId
    || categories.find((category) => category.id === article?.categoryId)?.id.toString()
    || categories.find((category) => category.name === article?.category)?.id.toString()
    || ''

  const addCategory = async () => {
    const name = categoryName.trim().replace(/\s+/g, ' ')
    if (!name) {
      toast.error('Please enter a category name.')
      return
    }

    setCreatingCategory(true)
    try {
      const category = await onCreateCategory(name)
      setCategoryId(category.id.toString())
      setCategoryName('')
      setShowCategoryInput(false)
      toast.success(`Category “${category.name}” added.`)
    } catch (categoryError) {
      toast.error(categoryError instanceof Error ? categoryError.message : 'Unable to add category.')
    } finally {
      setCreatingCategory(false)
    }
  }

  const addTags = () => {
    const candidates = tagInput.split(',').map((tag) => tag.trim()).filter(Boolean)
    if (candidates.some((tag) => tag.length > MAX_TAG_LENGTH)) {
      toast.error(`Each tag must not exceed ${MAX_TAG_LENGTH} characters.`)
      return false
    }

    const nextTags = mergeTags(tags, tagInput)
    if (nextTags.length > MAX_TAGS) {
      toast.error(`You can add up to ${MAX_TAGS} tags.`)
      return false
    }

    setTags(nextTags)
    setTagInput('')
    return true
  }

  const addSection = () => {
    const key = `section-new-${nextSectionKey.current}`
    nextSectionKey.current += 1
    setEditableSections((current) => [
      ...current,
      { key, section: { title: '', paragraphs: [] }, bulletKeys: [] },
    ])
  }

  const removeSection = (key: string) => {
    setEditableSections((current) => current.length > 1
      ? current.filter((item) => item.key !== key)
      : current)
  }

  const addBullet = (sectionKey: string) => {
    const bulletKey = `bullet-new-${nextBulletKey.current}`
    nextBulletKey.current += 1
    setEditableSections((current) => current.map((item) => item.key === sectionKey
      ? {
          ...item,
          section: {
            ...item.section,
            bullets: [...(item.section.bullets ?? []), { term: '', description: '' }],
          },
          bulletKeys: [...item.bulletKeys, bulletKey],
        }
      : item))
  }

  const removeBullet = (sectionKey: string, bulletIndex: number) => {
    setEditableSections((current) => current.map((item) => {
      if (item.key !== sectionKey) return item
      const bullets = (item.section.bullets ?? []).filter((_bullet, index) => index !== bulletIndex)
      return {
        ...item,
        section: { ...item.section, bullets: bullets.length ? bullets : undefined },
        bulletKeys: item.bulletKeys.filter((_key, index) => index !== bulletIndex),
      }
    }))
  }

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
    const sections = articleSectionsFromForm(form, editableSections.map((item) => item.section))
    if (sections.some((section) => section.bullets?.some((bullet) => (
      Boolean(bullet.term.trim()) !== Boolean(bullet.description.trim())
    )))) {
      toast.error('Each bullet must include both a term and description.')
      return
    }
    if (!sections.some((section) => section.paragraphs.length || section.bullets?.some(
      (bullet) => bullet.term.trim() || bullet.description.trim(),
    ))) {
      toast.error('Please enter article content.')
      return
    }
    const pendingTags = mergeTags(tags, tagInput)
    if (pendingTags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
      toast.error(`Each tag must not exceed ${MAX_TAG_LENGTH} characters.`)
      return
    }
    if (pendingTags.length > MAX_TAGS) {
      toast.error(`You can add up to ${MAX_TAGS} tags.`)
      return
    }
    setSaving(true)

    try {
      await onSave({
        categoryId: Number(form.get('categoryId')),
        tags: pendingTags,
        title: String(form.get('title') ?? ''),
        excerpt: String(form.get('introduction') ?? ''),
        image: thumbnail,
        status,
        sections,
      })
      toast.success(status === 'draft' ? 'Article saved as draft.' : 'Article saved successfully.')
      onArticles()
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : 'Unable to save article.')
    } finally {
      setSaving(false)
    }
  }

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

          <div className="create-article__field create-article__field--short">
            <div className="create-article__category-label">
              <span>Category</span>
              <button
                type="button"
                className="create-article__category-toggle"
                onClick={() => setShowCategoryInput((current) => !current)}
                aria-expanded={showCategoryInput}
                aria-controls="new-category-fields"
              >
                {showCategoryInput ? <X size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                {showCategoryInput ? 'Cancel' : 'Add category'}
              </button>
            </div>
            <select
              name="categoryId"
              value={selectedCategoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
              disabled={categories.length === 0}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {showCategoryInput && (
              <div id="new-category-fields" className="create-article__category-add">
                <input
                  value={categoryName}
                  maxLength={100}
                  placeholder="New category name"
                  aria-label="New category name"
                  autoFocus
                  disabled={creatingCategory}
                  onChange={(event) => setCategoryName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      void addCategory()
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={creatingCategory || !categoryName.trim()}
                  onClick={() => { void addCategory() }}
                >
                  {creatingCategory ? 'Adding...' : 'Add'}
                </button>
              </div>
            )}
          </div>

          <div className="create-article__field create-article__field--tags">
            <label htmlFor="article-tags">Tags</label>
            <div className="create-article__tag-editor">
              {tags.map((tag) => (
                <span key={tag.toLocaleLowerCase()} className="create-article__tag">
                  {tag}
                  <button
                    type="button"
                    aria-label={`Remove tag ${tag}`}
                    onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </span>
              ))}
              <input
                id="article-tags"
                value={tagInput}
                placeholder={tags.length === 0 ? 'Type a tag and press Enter' : 'Add another tag'}
                disabled={tags.length >= MAX_TAGS}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault()
                    addTags()
                  } else if (event.key === 'Backspace' && tagInput === '' && tags.length > 0) {
                    setTags((current) => current.slice(0, -1))
                  }
                }}
                onBlur={() => {
                  if (tagInput.trim()) addTags()
                }}
              />
            </div>
            <span className="create-article__field-hint">
              Press Enter or comma to add a tag ({tags.length}/{MAX_TAGS}).
            </span>
          </div>

          <label className="create-article__field create-article__field--short create-article__field--disabled">
            <span>Author name</span>
            <input value={author.name || author.username || author.email} disabled />
          </label>

          <label className="create-article__field">
            <span>Title</span>
            <input
              name="title"
              defaultValue={article?.title ?? ''}
              placeholder="Article title"
              maxLength={200}
              required
            />
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

          {editableSections.map((editableSection, index) => {
            const { section } = editableSection
            return (
            <section className="create-article__content-section" key={editableSection.key}>
              <div className="create-article__content-section-header">
                <strong>Section {index + 1}</strong>
                {editableSections.length > 1 && (
                  <button
                    type="button"
                    className="create-article__section-action create-article__section-action--danger"
                    onClick={() => removeSection(editableSection.key)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Remove section
                  </button>
                )}
              </div>
              <label className="create-article__field">
                <span>Section {index + 1} heading (optional)</span>
                <input name={`section-title-${index}`} defaultValue={section.title} maxLength={200} />
              </label>
              <label className="create-article__field">
                <span>{editableSections.length === 1 ? 'Content' : `Section ${index + 1} content`}</span>
                <textarea
                  name={`section-content-${index}`}
                  defaultValue={section.paragraphs.join('\n\n')}
                  placeholder="Content"
                  className="create-article__content-input"
                />
              </label>
              {section.bullets?.map((bullet, bulletIndex) => (
                <div className="create-article__bullet" key={editableSection.bulletKeys[bulletIndex]}>
                  <div className="create-article__bullet-header">
                    <strong>Bullet {bulletIndex + 1}</strong>
                    <button
                      type="button"
                      className="create-article__section-action create-article__section-action--danger"
                      onClick={() => removeBullet(editableSection.key, bulletIndex)}
                    >
                      <X size={15} aria-hidden="true" />
                      Remove bullet
                    </button>
                  </div>
                  <label className="create-article__field">
                    <span>Section {index + 1}, bullet {bulletIndex + 1} term</span>
                    <input
                      name={`section-bullet-term-${index}-${bulletIndex}`}
                      defaultValue={bullet.term}
                      maxLength={200}
                    />
                  </label>
                  <label className="create-article__field">
                    <span>Section {index + 1}, bullet {bulletIndex + 1} description</span>
                    <textarea
                      name={`section-bullet-description-${index}-${bulletIndex}`}
                      defaultValue={bullet.description}
                      maxLength={5000}
                      rows={3}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="create-article__section-action"
                onClick={() => addBullet(editableSection.key)}
              >
                <Plus size={16} aria-hidden="true" />
                Add bullet
              </button>
            </section>
          )})}

          <button
            type="button"
            className="create-article__add-section"
            onClick={addSection}
          >
            <Plus size={18} aria-hidden="true" />
            Add section
          </button>

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
