export function BrandLogo() {
  return (
    <span className="brand-logo" aria-label="One More Page">
      <svg className="brand-logo__mark" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="12" fill="#183D35" />
        <path d="M13 12.5h14.5a3 3 0 0 1 3 3v17H16a3 3 0 0 0-3 3v-23Z" fill="#F6F3E9" />
        <path d="M13 35.5a3 3 0 0 1 3-3h16" stroke="#F6F3E9" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M19 19h7M19 24h5" stroke="#18B889" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M30.5 16.5v16" stroke="#A9C9BC" strokeWidth="2" />
      </svg>
      <span className="brand-logo__wordmark" aria-hidden="true">
        <span className="brand-logo__top">One More</span>
        <span className="brand-logo__bottom">Page<span className="brand-logo__period">.</span></span>
      </span>
    </span>
  )
}
