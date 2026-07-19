import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

interface AdminLoginPageProps {
  onAuthenticated: () => void
}

const DEMO_ADMIN_EMAIL = 'adminthompson@gmail.com'
const DEMO_ADMIN_PASSWORD = 'admin123'

export default function AdminLoginPage({ onAuthenticated }: AdminLoginPageProps) {
  const { t } = useTranslation()
  const [loginError, setLoginError] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const password = String(formData.get('password') ?? '')

    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      setLoginError(false)
      setLoginSuccess(true)
      return
    }

    setLoginError(true)
  }

  return (
    <main className="admin-login-page">
      {loginSuccess ? (
        <section className="admin-login-card admin-login-card--success" role="status">
          <div className="admin-login-card__language">
            <LanguageSwitcher />
          </div>
          <span className="admin-login-card__eyebrow">{t('admin.panel')}</span>
          <h1 className="admin-login-card__title">{t('admin.loginSuccess')}</h1>
          <p className="admin-login-card__welcome">{t('admin.welcome')}</p>
          <button type="button" className="admin-login-form__submit" onClick={onAuthenticated}>
            {t('auth.continue')}
          </button>
        </section>
      ) : (
        <section className="admin-login-card">
          <div className="admin-login-card__language">
            <LanguageSwitcher />
          </div>
          <span className="admin-login-card__eyebrow">{t('admin.panel')}</span>
          <h1 className="admin-login-card__title">{t('common.login')}</h1>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className={`admin-login-field${loginError ? ' admin-login-field--error' : ''}`}>
              <span>{t('auth.email')}</span>
              <input
                type="email"
                name="email"
                placeholder={t('auth.email')}
                autoComplete="username"
                aria-invalid={loginError ? 'true' : undefined}
                onInput={() => setLoginError(false)}
                required
              />
            </label>

            <label className={`admin-login-field${loginError ? ' admin-login-field--error' : ''}`}>
              <span>{t('auth.password')}</span>
              <input
                type="password"
                name="password"
                placeholder={t('auth.password')}
                autoComplete="current-password"
                aria-invalid={loginError ? 'true' : undefined}
                onInput={() => setLoginError(false)}
                required
              />
            </label>

            <button type="submit" className="admin-login-form__submit">
              {t('common.login')}
            </button>
          </form>
        </section>
      )}

      {loginError && (
        <div className="admin-login-toast" role="alert">
          <div>
            <strong>{t('admin.incorrectTitle')}</strong>
            <span>{t('admin.incorrectHelp')}</span>
          </div>
          <button type="button" aria-label={t('admin.closeError')} onClick={() => setLoginError(false)}>
            ×
          </button>
        </div>
      )}
    </main>
  )
}
