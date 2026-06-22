import { useState, type FormEvent } from 'react'

interface AdminLoginPageProps {
  onBack: () => void
}

const DEMO_ADMIN_EMAIL = 'adminthompson@gmail.com'
const DEMO_ADMIN_PASSWORD = 'admin123'

export default function AdminLoginPage({ onBack }: AdminLoginPageProps) {
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
          <span className="admin-login-card__eyebrow">Admin panel</span>
          <h1 className="admin-login-card__title">Login success</h1>
          <p className="admin-login-card__welcome">Welcome, Thompson P.</p>
          <button type="button" className="admin-login-form__submit" onClick={onBack}>
            Continue
          </button>
        </section>
      ) : (
        <section className="admin-login-card">
          <span className="admin-login-card__eyebrow">Admin panel</span>
          <h1 className="admin-login-card__title">Log in</h1>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <label className={`admin-login-field${loginError ? ' admin-login-field--error' : ''}`}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="username"
                aria-invalid={loginError ? 'true' : undefined}
                onInput={() => setLoginError(false)}
                required
              />
            </label>

            <label className={`admin-login-field${loginError ? ' admin-login-field--error' : ''}`}>
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                aria-invalid={loginError ? 'true' : undefined}
                onInput={() => setLoginError(false)}
                required
              />
            </label>

            <button type="submit" className="admin-login-form__submit">
              Log in
            </button>
          </form>
        </section>
      )}

      {loginError && (
        <div className="admin-login-toast" role="alert">
          <div>
            <strong>Your password is incorrect or this email doesn’t exist</strong>
            <span>Please try another password or email</span>
          </div>
          <button type="button" aria-label="Close error" onClick={() => setLoginError(false)}>
            ×
          </button>
        </div>
      )}
    </main>
  )
}
