import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { RotateCcw, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { MemberProfile } from '../data/member'
import { SiteHeader } from './SiteHeader'

export type MemberView = 'profile' | 'reset-password'

interface MemberPageProps {
  member: MemberProfile
  view: MemberView
  onBack: () => void
  onNavigate: (view: MemberView) => void
  onSave: (member: MemberProfile) => void
  onLogout: () => void
}

function ProfileIcon() {
  return <User className="member-menu__icon" size={20} strokeWidth={1.6} aria-hidden="true" />
}

function PasswordIcon() {
  return <RotateCcw className="member-menu__icon" size={20} strokeWidth={1.6} aria-hidden="true" />
}

export default function MemberPage({ member, view, onBack, onNavigate, onSave, onLogout }: MemberPageProps) {
  const { t } = useTranslation()
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
    setMessage(t('member.profileSaved'))
  }

  const handlePasswordSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('newPassword') ?? '')
    const confirmation = String(formData.get('confirmPassword') ?? '')

    if (password !== confirmation) {
      setMessage(t('member.passwordsDoNotMatch'))
      return
    }

    event.currentTarget.reset()
    setMessage(t('member.passwordUpdated'))
  }

  return (
    <div className="member-page">
      <SiteHeader
        className="page member-navbar"
        member={member}
        onHome={onBack}
        onProfile={() => onNavigate('profile')}
        onResetPassword={() => onNavigate('reset-password')}
        onLogout={onLogout}
      />

      <div className="member-layout">
        <aside className="member-sidebar" aria-label={t('member.settings')}>
          <button
            type="button"
            className={view === 'profile' ? 'member-menu member-menu--active' : 'member-menu'}
            onClick={() => { setMessage(''); onNavigate('profile') }}
          >
            <ProfileIcon /> {t('common.profile')}
          </button>
          <button
            type="button"
            className={view === 'reset-password' ? 'member-menu member-menu--active' : 'member-menu'}
            onClick={() => { setMessage(''); onNavigate('reset-password') }}
          >
            <PasswordIcon /> {t('common.resetPassword')}
          </button>
        </aside>

        <main className="member-content">
          {view === 'profile' ? (
            <form className="member-card" onSubmit={handleProfileSave}>
              <div className="member-card__photo">
                <img src={draft.avatar} alt={t('member.profilePreview')} />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="visually-hidden"
                />
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  {t('member.uploadProfilePicture')}
                </button>
              </div>

              <div className="member-card__divider" />

              <label className="member-field">
                <span>{t('member.name')}</span>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label className="member-field">
                <span>{t('member.username')}</span>
                <input
                  value={draft.username}
                  onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
                  required
                />
              </label>
              <label className="member-field member-field--disabled">
                <span>{t('member.email')}</span>
                <input value={draft.email} disabled />
              </label>

              <button type="submit" className="member-card__save">{t('member.save')}</button>
            </form>
          ) : (
            <form className="member-card member-card--password" onSubmit={handlePasswordSave}>
              <h1>{t('common.resetPassword')}</h1>
              <label className="member-field">
                <span>{t('member.currentPassword')}</span>
                <input type="password" name="currentPassword" autoComplete="current-password" required />
              </label>
              <label className="member-field">
                <span>{t('member.newPassword')}</span>
                <input type="password" name="newPassword" autoComplete="new-password" minLength={8} required />
              </label>
              <label className="member-field">
                <span>{t('member.confirmNewPassword')}</span>
                <input type="password" name="confirmPassword" autoComplete="new-password" minLength={8} required />
              </label>
              <button type="submit" className="member-card__save">{t('member.save')}</button>
            </form>
          )}

          {message && (
            <p className={`member-message${message === t('member.passwordsDoNotMatch') ? ' member-message--error' : ''}`} role="status">
              {message}
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
