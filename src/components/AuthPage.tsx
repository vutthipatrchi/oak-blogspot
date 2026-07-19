import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultMember, type MemberProfile } from '../data/member'
import { LanguageSwitcher } from './LanguageSwitcher'

export type AuthMode = 'signup' | 'login'

interface AuthPageProps {
  mode: AuthMode
  audience?: 'member' | 'admin'
  onBack: () => void
  onModeChange: (mode: AuthMode) => void
  onAuthenticated: (member: MemberProfile) => void
}

export default function AuthPage({ mode, audience = 'member', onBack, onModeChange, onAuthenticated }: AuthPageProps) {
  const isSignUp = mode === 'signup'
  const { t } = useTranslation()
  const [emailError, setEmailError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredMember, setRegisteredMember] = useState<MemberProfile | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (!isSignUp) {
      if (audience === 'admin') {
        const identifier = String(formData.get('identifier') ?? '').trim().toLowerCase()
        const password = String(formData.get('password') ?? '')
        if (identifier !== 'adminthompson@gmail.com' || password !== 'admin123') {
          setEmailError(t('admin.incorrectTitle'))
          return
        }
      }
      onAuthenticated(defaultMember)
      return
    }

    const email = String(formData.get('email') ?? '').trim().toLowerCase()

    if (email === 'moodeng.cute@gmail.com') {
      setEmailError(t('auth.emailTaken'))
      const emailInput = event.currentTarget.elements.namedItem('email')
      if (emailInput instanceof HTMLInputElement) emailInput.focus()
      return
    }

    setEmailError('')
    setRegisteredMember({
      ...defaultMember,
      name: String(formData.get('name') ?? '').trim(),
      username: String(formData.get('username') ?? '').trim(),
      email,
    })
    setRegistrationSuccess(true)
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="page auth-header__inner">
          <button type="button" className="logo auth-logo" onClick={onBack}>
            hh.
          </button>
          <div className="header__actions">
            <LanguageSwitcher />
            <button
              type="button"
              className={`btn ${isSignUp ? 'btn--outline' : 'btn--solid'}`}
              onClick={() => onModeChange('login')}
            >
              {t('common.login')}
            </button>
            <button
              type="button"
              className={`btn ${isSignUp ? 'btn--solid' : 'btn--outline'}`}
              onClick={() => onModeChange('signup')}
            >
              {t('common.signup')}
            </button>
          </div>
        </div>
      </header>

      <main className="auth-main">
        {registrationSuccess ? (
          <section className="auth-card auth-card--success" role="status">
            <div className="auth-success__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m7 12.5 3.25 3.25L17.5 8.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="auth-success__title">{t('auth.registrationSuccess')}</h1>
            <button
              type="button"
              className="auth-form__submit auth-success__continue"
                    onClick={() => registeredMember && onAuthenticated(registeredMember)}
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
                required
              />
            </label>

            <button type="submit" className="auth-form__submit">
              {isSignUp ? t('common.signup') : t('common.login')}
            </button>
          </form>

          <p className="auth-card__switch">
            {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}{' '}
            <button
              type="button"
              className="auth-card__switch-btn"
              onClick={() => onModeChange(isSignUp ? 'login' : 'signup')}
            >
              {isSignUp ? t('common.login') : t('common.signup')}
            </button>
          </p>
        </section>
        )}
      </main>
    </div>
  )
}
