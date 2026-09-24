import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, completePasswordRecovery } from '../lib/auth'
import { SiteHeader } from './SiteHeader'
import { PasswordInput } from './ui/PasswordInput'

interface PasswordResetPageProps {
  onHome: () => void
  onLogin: () => void
}

export default function PasswordResetPage({ onHome, onLogin }: PasswordResetPageProps) {
  const { t } = useTranslation()
  const [refreshToken, setRefreshToken] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    return params.get('type') === 'recovery' ? params.get('refresh_token') ?? '' : ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('newPassword') ?? '')
    const confirmation = String(formData.get('confirmPassword') ?? '')
    if (password !== confirmation) {
      setErrorMessage(t('auth.passwordsDoNotMatch'))
      return
    }
    setSubmitting(true)
    setErrorMessage('')
    try {
      await completePasswordRecovery(refreshToken, password)
      setRefreshToken('')
      setCompleted(true)
    } catch (error) {
      setErrorMessage(error instanceof ApiError && error.statusCode === 401
        ? t('auth.recoveryLinkInvalid')
        : t('auth.passwordResetFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <SiteHeader className="page auth-header__inner" onHome={onHome} onLogin={onLogin} />
      </div>
      <main className="auth-main">
        <section className="auth-card auth-card--login auth-card--password-reset">
          <h1 className="auth-card__title">{t('auth.setNewPassword')}</h1>
          {completed ? (
            <p className="auth-recovery__message" role="status">{t('auth.passwordResetSuccess')}</p>
          ) : !refreshToken ? (
            <p className="auth-form__error" role="alert">{t('auth.recoveryLinkInvalid')}</p>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <PasswordInput fieldClassName="auth-field" label={t('auth.newPassword')} name="newPassword" autoComplete="new-password" minLength={8} required />
              <PasswordInput fieldClassName="auth-field" label={t('auth.confirmPassword')} name="confirmPassword" autoComplete="new-password" minLength={8} required />
              {errorMessage && <p className="auth-form__error" role="alert">{errorMessage}</p>}
              <button type="submit" className="auth-form__submit" disabled={submitting}>
                {submitting ? '...' : t('auth.saveNewPassword')}
              </button>
            </form>
          )}
          <button type="button" className="auth-recovery__back" onClick={onLogin}>
            {t('auth.backToLogin')}
          </button>
        </section>
      </main>
    </div>
  )
}
