import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { signInMember, signUpMember, type StoredAuth } from '../lib/auth'
import { SiteHeader } from './SiteHeader'

export type AuthMode = 'signup' | 'login'

interface AuthPageProps {
  mode: AuthMode
  audience?: 'member' | 'admin'
  onBack: () => void
  onModeChange: (mode: AuthMode) => void
  onAuthenticated: (auth: StoredAuth) => void
}

export default function AuthPage({ mode, audience = 'member', onBack, onModeChange, onAuthenticated }: AuthPageProps) {
  const isSignUp = mode === 'signup' && audience === 'member'
  const { t } = useTranslation()
  const [emailError, setEmailError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredAuth, setRegisteredAuth] = useState<StoredAuth | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setSubmitting(true)
    setEmailError('')
    try {
      if (isSignUp) {
        const auth = await signUpMember({
          name: String(formData.get('name') ?? '').trim(),
          username: String(formData.get('username') ?? '').trim(),
          email: String(formData.get('email') ?? '').trim(),
          password: String(formData.get('password') ?? ''),
        })
        setRegisteredAuth(auth.session ? auth as StoredAuth : null)
        setRegistrationSuccess(true)
      } else {
        const auth = await signInMember(
          String(formData.get('identifier') ?? '').trim(),
          String(formData.get('password') ?? ''),
          audience,
        )
        onAuthenticated(auth)
      }
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : t('admin.incorrectTitle'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <SiteHeader
          className="page auth-header__inner"
          activeAuthMode={mode}
          onHome={onBack}
          onLogin={() => onModeChange('login')}
          onSignUp={audience === 'member' ? () => onModeChange('signup') : undefined}
        />
      </div>

      <main className="auth-main">
        {registrationSuccess ? (
          <section className="auth-card auth-card--success" role="status">
            <div className="auth-success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 12.5 3.25 3.25L17.5 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="auth-success__title">{t('auth.registrationSuccess')}</h1>
            {!registeredAuth && <p>{t('auth.verificationSent')}</p>}
            <button
              type="button"
              className="auth-form__submit auth-success__continue"
              onClick={() => registeredAuth ? onAuthenticated(registeredAuth) : onModeChange('login')}
            >
              {t('auth.continue')}
            </button>
          </section>
        ) : (
        <section className={`auth-card${isSignUp ? '' : ' auth-card--login'}`}>
          <h1 className="auth-card__title">{isSignUp ? t('common.signup') : t('common.login')}</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <label className="auth-field">
                  <span>{t('auth.name')}</span>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('auth.fullName')}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>{t('auth.username')}</span>
                  <input
                    type="text"
                    name="username"
                    placeholder={t('auth.username')}
                    autoComplete="username"
                    required
                  />
                </label>
              </>
            )}

            <label className={`auth-field${emailError ? ' auth-field--error' : ''}`}>
              <span>{isSignUp ? t('auth.email') : t('auth.emailOrUsername')}</span>
              <input
                type={isSignUp ? 'email' : 'text'}
                name={isSignUp ? 'email' : 'identifier'}
                placeholder={isSignUp ? t('auth.email') : t('auth.emailOrUsername')}
                autoComplete={isSignUp ? 'email' : 'username'}
                aria-invalid={emailError ? 'true' : undefined}
                aria-describedby={emailError ? 'signup-email-error' : undefined}
                onInput={() => setEmailError('')}
                required
              />
              {emailError && (
                <span id="signup-email-error" className="auth-field__error">
                  {emailError}
                </span>
              )}
            </label>

            <label className="auth-field">
              <span>{t('auth.password')}</span>
              <input
                type="password"
                name="password"
                placeholder={t('auth.password')}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={8}
                required
              />
            </label>

            <button type="submit" className="auth-form__submit" disabled={submitting}>
              {submitting ? '...' : isSignUp ? t('common.signup') : t('common.login')}
            </button>
          </form>

          {audience === 'member' && <p className="auth-card__switch">
            {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}{' '}
            <button
              type="button"
              className="auth-card__switch-btn"
              onClick={() => onModeChange(isSignUp ? 'login' : 'signup')}
            >
              {isSignUp ? t('common.login') : t('common.signup')}
            </button>
          </p>}
        </section>
        )}
      </main>
    </div>
  )
}
