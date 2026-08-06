import { useEffect, useRef } from 'react'

interface DeleteArticleDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteArticleDialog({ open, onCancel, onConfirm }: DeleteArticleDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel, open])

  if (!open) return null

  return (
    <div className="delete-article-dialog__overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <div className="delete-article-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-article-title" aria-describedby="delete-article-description">
        <button type="button" className="delete-article-dialog__close" aria-label="Close" onClick={onCancel}>&times;</button>
        <h2 id="delete-article-title">Delete article</h2>
        <p id="delete-article-description">Do you want to delete this article?</p>
        <div className="delete-article-dialog__actions">
          <button ref={cancelRef} type="button" className="delete-article-dialog__cancel" onClick={onCancel}>Cancel</button>
          <button type="button" className="delete-article-dialog__confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}
