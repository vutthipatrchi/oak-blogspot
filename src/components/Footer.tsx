import { Briefcase, Code, Globe } from 'lucide-react'

interface FooterProps {
  onAdminLogin: () => void
}

export function Footer({ onAdminLogin }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__left">
        <span className="footer__label">Get in touch</span>
        <div className="footer__social">
          <a href="#" aria-label="LinkedIn" className="social-link">
            <Briefcase aria-hidden="true" />
          </a>
          <a href="#" aria-label="GitHub" className="social-link">
            <Code aria-hidden="true" />
          </a>
          <a href="#" aria-label="Website" className="social-link">
            <Globe aria-hidden="true" />
          </a>
        </div>
      </div>
      <button
        type="button"
        className="footer__home footer__home--btn"
        onClick={onAdminLogin}
      >
        Admin panel
      </button>
    </footer>
  )
}
