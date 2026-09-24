import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiError, requestPasswordRecovery, signInMember, signUpMember, type StoredAuth } from '../lib/auth'
import { SiteHeader } from './SiteHeader'
import { PasswordInput } from './ui/PasswordInput'

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
  const [loginError, setLoginError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredAuth, setRegisteredAuth] = useState<StoredAuth | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoverySent, setRecoverySent] = useState(false)
  const [recoveryError, setRecoveryError] = useState('')

  const handleRecoveryRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setRecoveryError('')
    try {
      await requestPasswordRecovery(recoveryEmail.trim())
      setRecoverySent(true)
    } catch (error) {
      setRecoveryError(error instanceof ApiError && error.statusCode === 429
        ? t('auth.tooManyRecoveryRequests')
        : error instanceof ApiError && error.statusCode === 503
          ? t('auth.recoveryServiceUnavailable')
          : t('auth.recoveryRequestFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setSubmitting(true)
    setEmailError('')
    setLoginError('')
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
      if (isSignUp) {
        setEmailError(error instanceof Error ? error.message : t('auth.signupFailed'))
      } else if (error instanceof ApiError) {
        const messageKey = error.statusCode === 401 ? 'auth.invalidCredentials'
          : error.statusCode === 403 ? 'auth.adminRequired'
            : error.statusCode === 429 ? 'auth.tooManyAttempts'
              : error.statusCode === 503 ? 'auth.serviceUnavailable'
                : 'auth.loginFailed'
        setLoginError(t(messageKey))
      } else {
        setLoginError(t('auth.connectionError'))
      }
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
        {forgotPassword ? (
          <section className="auth-card auth-card--login">
            <h1 className="auth-card__title">{t('auth.forgotPassword')}</h1>
            {recoverySent ? (
              <p className="auth-recovery__message" role="status">{t('auth.recoverySent')}</p>
            ) : (
              <form className="auth-form" onSubmit={handleRecoveryRequest}>
                <p className="auth-recovery__help">{t('auth.recoveryHelp')}</p>
                <label className="auth-field">
                  <span>{t('auth.email')}</span>
                  <input type="email" value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} autoComplete="email" required />
                </label>
                {recoveryError && <p className="auth-form__error" role="alert">{recoveryError}</p>}
                <button type="submit" className="auth-form__submit" disabled={submitting}>
                  {submitting ? '...' : t('auth.sendRecoveryLink')}
                </button>
              </form>
            )}
            <button type="button" className="auth-recovery__back" onClick={() => setForgotPassword(false)}>
              {t('auth.backToLogin')}
            </button>
          </section>
        ) : registrationSuccess ? (
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
                onInput={() => {
                  setEmailError('')
                  setLoginError('')
                }}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
              {emailError && (
                <span id="signup-email-error" className="auth-field__error">
                  {emailError}
                </span>
              )}
            </label>

            <PasswordInput
              fieldClassName="auth-field"
              label={t('auth.password')}
              name="password"
              placeholder={t('auth.password')}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={8}
              onInput={() => setLoginError('')}
              required
            />

            {!isSignUp && (
              <button
                type="button"
                className="auth-form__forgot"
                onClick={() => {
                  setRecoveryEmail(identifier.includes('@') ? identifier : '')
                  setRecoveryError('')
                  setRecoverySent(false)
                  setForgotPassword(true)
                }}
              >
                {t('auth.forgotPassword')}
              </button>
            )}

            {loginError && <p className="auth-form__error" role="alert">{loginError}</p>}

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
