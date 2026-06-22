import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { MemberProfile } from '../data/member'

export type MemberView = 'profile' | 'reset-password'

interface MemberPageProps {
  member: MemberProfile
  view: MemberView
  onBack: () => void
  onNavigate: (view: MemberView) => void
  onSave: (member: MemberProfile) => void
}

function ProfileIcon() {
  return <span className="member-menu__icon" aria-hidden="true">♙</span>
}

function PasswordIcon() {
  return <span className="member-menu__icon" aria-hidden="true">↶</span>
}

export default function MemberPage({ member, view, onBack, onNavigate, onSave }: MemberPageProps) {
  const [draft, setDraft] = useState(member)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((current) => ({ ...current, avatar: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(draft)
    setMessage('Profile saved')
  }

  const handlePasswordSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('newPassword') ?? '')
    const confirmation = String(formData.get('confirmPassword') ?? '')

    if (password !== confirmation) {
      setMessage('Passwords do not match')
      return
    }

    event.currentTarget.reset()
    setMessage('Password updated')
  }

  return (
    <div className="member-page">
      <header className="member-navbar">
        <button type="button" className="logo member-navbar__logo" onClick={onBack}>hh.</button>
        <div className="member-navbar__account">
          <button type="button" className="member-navbar__bell" aria-label="Notifications">♧</button>
          <button type="button" className="member-navbar__user" onClick={() => onNavigate('profile')}>
            <img src={member.avatar} alt="" />
            <span>{member.name}</span>
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
      </header>

      <div className="member-layout">
        <aside className="member-sidebar" aria-label="Member settings">
          <button
            type="button"
            className={view === 'profile' ? 'member-menu member-menu--active' : 'member-menu'}
            onClick={() => { setMessage(''); onNavigate('profile') }}
          >
            <ProfileIcon /> Profile
          </button>
          <button
            type="button"
            className={view === 'reset-password' ? 'member-menu member-menu--active' : 'member-menu'}
            onClick={() => { setMessage(''); onNavigate('reset-password') }}
          >
            <PasswordIcon /> Reset password
          </button>
        </aside>

        <main className="member-content">
          {view === 'profile' ? (
            <form className="member-card" onSubmit={handleProfileSave}>
              <div className="member-card__photo">
                <img src={draft.avatar} alt="Profile preview" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="visually-hidden"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  Upload profile picture
                </button>
              </div>

              <div className="member-card__divider" />

              <label className="member-field">
                <span>Name</span>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label className="member-field">
                <span>Username</span>
                <input
                  value={draft.username}
                  onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
                  required
                />
              </label>
              <label className="member-field member-field--disabled">
                <span>Email</span>
                <input value={draft.email} disabled />
              </label>

              <button type="submit" className="member-card__save">Save</button>
            </form>
          ) : (
            <form className="member-card member-card--password" onSubmit={handlePasswordSave}>
              <h1>Reset password</h1>
              <label className="member-field">
                <span>Current password</span>
                <input type="password" name="currentPassword" autoComplete="current-password" required />
              </label>
              <label className="member-field">
                <span>New password</span>
                <input type="password" name="newPassword" autoComplete="new-password" minLength={8} required />
              </label>
              <label className="member-field">
                <span>Confirm new password</span>
                <input type="password" name="confirmPassword" autoComplete="new-password" minLength={8} required />
              </label>
              <button type="submit" className="member-card__save">Save</button>
            </form>
          )}

          {message && (
            <p className={`member-message${message.includes('match') ? ' member-message--error' : ''}`} role="status">
              {message}
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
