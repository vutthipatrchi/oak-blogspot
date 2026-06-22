import { useState, type FormEvent } from 'react'
import { defaultMember, type MemberProfile } from '../data/member'

export type AuthMode = 'signup' | 'login'

interface AuthPageProps {
  mode: AuthMode
  onBack: () => void
  onModeChange: (mode: AuthMode) => void
  onAuthenticated: (member: MemberProfile) => void
}

export default function AuthPage({ mode, onBack, onModeChange, onAuthenticated }: AuthPageProps) {
  const isSignUp = mode === 'signup'
  const [emailError, setEmailError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registeredMember, setRegisteredMember] = useState<MemberProfile | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (!isSignUp) {
      onAuthenticated(defaultMember)
      return
    }

    const email = String(formData.get('email') ?? '').trim().toLowerCase()

    if (email === 'moodeng.cute@gmail.com') {
      setEmailError('Email is already taken, Please try another email.')
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
            <button
              type="button"
              className={`btn ${isSignUp ? 'btn--outline' : 'btn--solid'}`}
              onClick={() => onModeChange('login')}
            >
              Log in
            </button>
            <button
              type="button"
              className={`btn ${isSignUp ? 'btn--solid' : 'btn--outline'}`}
              onClick={() => onModeChange('signup')}
            >
              Sign up
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
            <h1 className="auth-success__title">Registration success</h1>
            <button
              type="button"
              className="auth-form__submit auth-success__continue"
              onClick={() => registeredMember && onAuthenticated(registeredMember)}
            >
              Continue
            </button>
          </section>
        ) : (
        <section className={`auth-card${isSignUp ? '' : ' auth-card--login'}`}>
          <h1 className="auth-card__title">{isSignUp ? 'Sign up' : 'Log in'}</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <label className="auth-field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>Username</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    required
                  />
                </label>
              </>
            )}

            <label className={`auth-field${emailError ? ' auth-field--error' : ''}`}>
              <span>{isSignUp ? 'Email' : 'Email or username'}</span>
              <input
                type={isSignUp ? 'email' : 'text'}
                name={isSignUp ? 'email' : 'identifier'}
                placeholder={isSignUp ? 'Email' : 'Email or username'}
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
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
              />
            </label>

            <button type="submit" className="auth-form__submit">
              {isSignUp ? 'Sign up' : 'Log in'}
            </button>
          </form>

          <p className="auth-card__switch">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="auth-card__switch-btn"
              onClick={() => onModeChange(isSignUp ? 'login' : 'signup')}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </section>
        )}
      </main>
    </div>
  )
}
