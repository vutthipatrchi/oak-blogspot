import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { RotateCcw, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { MemberProfile } from '../data/member'
import { uploadMemberProfileImage } from '../lib/auth'
import { SiteHeader } from './SiteHeader'
import { useToast } from './ui/use-toast'

export type MemberView = 'profile' | 'reset-password'

interface MemberPageProps {
  member: MemberProfile
  view: MemberView
  onBack: () => void
  onNavigate: (view: MemberView) => void
  onSave: (member: MemberProfile) => Promise<void>
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<unknown>
  onLogout: () => void
}

function ProfileIcon() {
  return <User className="member-menu__icon" size={20} strokeWidth={1.6} aria-hidden="true" />
}

function PasswordIcon() {
  return <RotateCcw className="member-menu__icon" size={20} strokeWidth={1.6} aria-hidden="true" />
}

export default function MemberPage({ member, view, onBack, onNavigate, onSave, onPasswordChange, onLogout }: MemberPageProps) {
  const { t } = useTranslation()
  const toast = useToast()
  const [draft, setDraft] = useState(member)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
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
    const previousAvatar = draft.avatar
    const previousAvatarPath = draft.avatarPath
    setDraft((current) => ({ ...current, avatar: objectUrl }))
    setUploading(true)
    try {
      const uploaded = await uploadMemberProfileImage(file)
      setDraft((current) => ({
        ...current,
        avatar: uploaded.url,
        avatarPath: uploaded.path,
      }))
      toast.success('Profile image uploaded successfully.')
    } catch (error) {
      setDraft((current) => ({
        ...current,
        avatar: previousAvatar,
        avatarPath: previousAvatarPath,
      }))
      toast.error(error instanceof Error ? error.message : 'Unable to upload profile image.')
    } finally {
      URL.revokeObjectURL(objectUrl)
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (uploading) return
    try {
      await onSave(draft)
      toast.success(t('member.profileSaved'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save profile.')
    }
  }

  const handlePasswordSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('newPassword') ?? '')
    const confirmation = String(formData.get('confirmPassword') ?? '')

    if (password !== confirmation) {
      toast.error(t('member.passwordsDoNotMatch'))
      return
    }

    try {
      await onPasswordChange(String(formData.get('currentPassword') ?? ''), password)
      event.currentTarget.reset()
      toast.success(t('member.passwordUpdated'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update password.')
    }
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
            onClick={() => onNavigate('profile')}
          >
            <ProfileIcon /> {t('common.profile')}
          </button>
          <button
            type="button"
            className={view === 'reset-password' ? 'member-menu member-menu--active' : 'member-menu'}
            onClick={() => onNavigate('reset-password')}
          >
            <PasswordIcon /> {t('common.resetPassword')}
          </button>
        </aside>

        <main className="member-content">
          {view === 'profile' ? (
            <form className="member-card" onSubmit={handleProfileSave}>
              <div className="member-card__photo">
                <div className="member-card__avatar">
                  {draft.avatar ? (
                    <img src={draft.avatar} alt={t('member.profilePreview')} />
                  ) : (
                    <User
                      className="member-card__avatar-placeholder"
                      size={56}
                      strokeWidth={1.4}
                      role="img"
                      aria-label={t('member.profilePreview')}
                    />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => { void handleImageUpload(event) }}
                  className="visually-hidden"
                />
                <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? 'Uploading...' : t('member.uploadProfilePicture')}
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

              <button type="submit" className="member-card__save" disabled={uploading}>{t('member.save')}</button>
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
        </main>
      </div>
    </div>
  )
}
